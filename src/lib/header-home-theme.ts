export type HeaderVariant = "default" | "home";

export function getHeaderThemeClasses(variant: HeaderVariant) {
  if (variant === "home") {
    return {
      nav:
        "mx-8 sticky top-2 z-50 rounded-lg backdrop-blur supports-backdrop-filter:backdrop-blur border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] bg-[color-mix(in_srgb,var(--home-bg)_95%,transparent)]",
      menuTrigger:
        "text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_8%,transparent)]",
      menuContent:
        "bg-[var(--home-bg)] border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)]",
      menuGrid: "bg-[var(--home-bg)]",
      serviceCard:
        "group rounded-lg border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] p-4 hover:border-[color-mix(in_srgb,var(--home-purple)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-all",
      serviceTitle: "font-semibold text-[var(--home-text)] text-sm leading-tight",
      serviceDesc: "text-xs text-[var(--home-text)]/55 mt-1 line-clamp-2",
      price: "text-xs font-semibold text-[var(--home-accent)]",
      ghostBtn:
        "text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_8%,transparent)]",
      primaryBtn:
        "bg-[var(--home-btn-bg)] hover:opacity-90 text-[var(--home-btn-text)]",
      sheet: "w-72 bg-[var(--home-bg)] p-0 flex flex-col",
      sheetHeader:
        "flex items-center justify-between px-5 py-4 border-b border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)]",
      accordionTrigger:
        "px-5 py-3 text-sm font-medium text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] hover:no-underline rounded-none",
      mobileServiceCard:
        "rounded-xl border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] bg-[color-mix(in_srgb,var(--home-surface)_50%,transparent)] px-3 py-2.5 hover:border-[color-mix(in_srgb,var(--home-accent)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-all cursor-pointer",
      mobileDivider: "h-px bg-[color-mix(in_srgb,var(--home-purple)_10%,transparent)] mx-5 my-1",
      mobileLink:
        "flex items-center px-5 py-3 text-sm font-medium text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-colors",
      sheetFooter:
        "border-t border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] p-4",
      outlineBtn:
        "w-full border-[color-mix(in_srgb,var(--home-purple)_20%,transparent)] text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)]",
    };
  }

  // Default variant with proper light/dark mode support
  return {
    nav: "mx-8 sticky top-2 z-50 rounded-lg backdrop-blur supports-backdrop-filter:backdrop-blur border bg-white/95 dark:bg-[#2d063f]/95 border-gray-200 dark:border-[#7a219f]/20",
    menuTrigger: "text-gray-900 dark:text-[#efcafe] hover:bg-gray-100 dark:hover:bg-[#efcafe]/10",
    menuContent: "bg-white dark:bg-[#1d002c] border border-gray-200 dark:border-[#7a219f]/15",
    menuGrid: "bg-white dark:bg-[#1d002c]",
    serviceCard:
      "group rounded-lg border border-gray-200 dark:border-[#7a219f]/15 p-4 hover:border-gray-300 dark:hover:border-[#7a219f]/30 hover:bg-gray-50 dark:hover:bg-[#7a219f]/5 transition-all",
    serviceTitle: "font-semibold text-gray-900 dark:text-[#efcafe] text-sm leading-tight",
    serviceDesc: "text-xs text-gray-600 dark:text-[#efcafe]/70 mt-1 line-clamp-2",
    price: "text-xs font-semibold text-purple-600 dark:text-[#efcafe]",
    ghostBtn: "text-gray-900 dark:text-[#efcafe] hover:bg-gray-100 dark:hover:bg-[#efcafe]/10",
    primaryBtn: "bg-purple-600 dark:bg-[#efcafe] hover:bg-purple-700 dark:hover:bg-[#f7e0ac]/90 text-white dark:text-[#2d063f]",
    sheet: "w-72 bg-white dark:bg-[#1d002c] p-0 flex flex-col",
    sheetHeader:
      "flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-[#7a219f]/15",
    accordionTrigger:
      "px-5 py-3 text-sm font-medium text-gray-900 dark:text-[#efcafe] hover:bg-gray-100 dark:hover:bg-[#7a219f]/5 hover:no-underline rounded-none",
    mobileServiceCard:
      "rounded-xl border border-gray-200 dark:border-[#7a219f]/15 bg-gray-50 dark:bg-[#26043e] px-3 py-2.5 hover:border-gray-300 dark:hover:border-[#7a219f]/30 hover:bg-gray-100 dark:hover:bg-[#7a219f]/8 transition-all cursor-pointer",
    mobileDivider: "h-px bg-gray-200 dark:bg-[#7a219f]/10 mx-5 my-1",
    mobileLink:
      "flex items-center px-5 py-3 text-sm font-medium text-gray-900 dark:text-[#efcafe] hover:bg-gray-100 dark:hover:bg-[#7a219f]/5 transition-colors",
    sheetFooter: "border-t border-gray-200 dark:border-[#7a219f]/15 p-4",
    outlineBtn:
      "w-full border border-gray-300 dark:border-[#7a219f]/20 text-gray-900 dark:text-[#efcafe] hover:bg-gray-100 dark:hover:bg-[#7a219f]/5",
  };
}
