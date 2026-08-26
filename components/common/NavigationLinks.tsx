"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/updates", label: "Updates" },
  { href: "/about", label: "About" },
  { href: "/feedback", label: "Feedback" },
];

type NavigationLinksProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

// Both headers use this component, so their links and active styling stay identical.
export function NavigationLinks({
  mobile = false,
  onNavigate,
}: NavigationLinksProps) {
  const pathname = usePathname() ?? "";

  return navigationItems.map((item) => {
    // /dashboard/planners/42 should still highlight the Dashboard link.
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    const defaultClassName = mobile
      ? "rounded-md px-3 py-2 text-base font-medium text-gray-600 transition duration-200 hover:scale-[1.02] hover:bg-muted hover:text-foreground motion-reduce:transform-none"
      : "rounded-md px-2 py-1 text-lg font-medium text-gray-600 transition duration-200 hover:scale-[1.03] hover:bg-muted hover:text-foreground motion-reduce:transform-none";
    // nav-active has a dedicated colour, so changing this box does not affect cards elsewhere.
    const activeClassName = "nav-active text-primary";

    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`${defaultClassName} ${isActive ? activeClassName : ""}`}
        href={item.href}
        key={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  });
}
