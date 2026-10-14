import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SiteHeader } from "@/components/account/SiteHeader";
import { AdminDashboardShell } from "@/components/admin-dashboard/AdminDashboardShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const startTime = Date.now();

  const [users, bookings, products, counts, inquiries] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
    Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]),
    prisma.serviceInquiry.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  console.log(`[Admin] Initial queries completed in ${Date.now() - startTime}ms`);

  const [totalUsers, totalBookings, pending, confirmed, completed, cancelled] = counts;

  // Enrich inquiries with service details - fix N+1 query by fetching all services at once
  const serviceLookupStart = Date.now();
  const uniqueServiceIds = [...new Set(inquiries.map((i) => i.serviceId))];
  const services = await prisma.product.findMany({
    where: { id: { in: uniqueServiceIds } },
    select: { id: true, title: true, description: true, image: true },
  });

  const serviceMap = new Map(services.map((s) => [s.id, s]));

  const inquiriesWithServices = inquiries.map((inquiry) => ({
    ...inquiry,
    service: serviceMap.get(inquiry.serviceId) || {
      id: inquiry.serviceId,
      title: "Unknown Service",
      description: "",
    },
    createdAt: inquiry.createdAt.toISOString(),
  }));

  console.log(`[Admin] Service lookup completed in ${Date.now() - serviceLookupStart}ms`);
  console.log(`[Admin] Total page load time: ${Date.now() - startTime}ms`);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-1 flex-col bg-[#1d002c]">
        <SiteHeader title="Admin Panel" />
        <div className="flex-1 overflow-auto bg-[#26043e]">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
              <AdminDashboardShell
                users={users}
                bookings={bookings}
                products={products.map((p) => ({
                  id: p.id,
                  title: p.title,
                  price: p.price,
                  description: p.description,
                  image: p.image,
                  benefits: p.benefits,
                  requiresInquiry: p.requiresInquiry,
                }))}
                stats={{
                  totalUsers,
                  totalBookings,
                  pending,
                  confirmed,
                  completed,
                  cancelled,
                }}
                inquiries={inquiriesWithServices}
              />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
