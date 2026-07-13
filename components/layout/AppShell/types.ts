import type { ReactNode } from "react";

export interface AppShellNavigationItem {
  active?: boolean;
  href: string;
  icon?: ReactNode;
  label: string;
  trailing?: ReactNode;
}

export interface AppShellProps {
  actions?: ReactNode;
  brand: string;
  children: ReactNode;
  contextLabel?: string;
  navigation: AppShellNavigationItem[];
  sidebarFooter?: ReactNode;
}
