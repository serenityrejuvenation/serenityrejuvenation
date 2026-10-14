import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCached, invalidateCache } from "@/lib/cache";

// GET /api/admin/services - List all services
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Use cache for services (5 minute TTL)
    const products = await getCached(
      "admin:services",
      () =>
        prisma.product.findMany({
          orderBy: { title: "asc" },
        }),
      5 * 60 * 1000 // 5 minutes
    );

    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/admin/services completed in ${duration}ms (cached)`);

    return NextResponse.json({ services: products });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/admin/services failed after ${duration}ms:`, error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { title, price, description, image, benefits, requiresInquiry, duration } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: price || null,
        description,
        image: image || "/images/placeholder.jpg",
        benefits: benefits || [],
        requiresInquiry: requiresInquiry || false,
      },
    });

    // Invalidate cache after creating service
    invalidateCache("admin:services");

    return NextResponse.json({ success: true, service: product });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

// PATCH /api/admin/services - Update existing service
export async function PATCH(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { id, title, price, description, image, benefits, requiresInquiry } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(price !== undefined && { price: price || null }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(benefits !== undefined && { benefits }),
        ...(requiresInquiry !== undefined && { requiresInquiry }),
      },
    });

    // Invalidate cache after updating service
    invalidateCache("admin:services");

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/admin/services - Delete a service
export async function DELETE(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // Check if service has any bookings
    const bookingCount = await prisma.booking.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete service with existing bookings. Archive it instead." },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    // Invalidate cache after deleting service
    invalidateCache("admin:services");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
