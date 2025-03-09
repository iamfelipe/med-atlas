"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "pointer-events-none" : "text-muted-foreground" // Apply muted class if not active
      )}
    >
      {children}
    </Link>
  );
};

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink href="/dashboard/users">Users</NavLink>
      <NavLink href="/dashboard/patient">Patients</NavLink>
      <NavLink href="/dashboard/ehr">EHRs</NavLink>
    </nav>
  );
}
