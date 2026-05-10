"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  TrendingUp,
  PlusCircle,
  ArrowRightLeft,
  MinusCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Receipt,
  },
  {
    title: "6 Jars",
    url: "/jars",
    icon: Wallet,
  },
  {
    title: "Investments",
    url: "/investments",
    icon: TrendingUp,
  },
];

const actionItems = [
  {
    title: "Add Income",
    url: "/transactions/income",
    icon: PlusCircle,
    color: "text-emerald-500",
  },
  {
    title: "Add Expense",
    url: "/transactions/expense",
    icon: MinusCircle,
    color: "text-rose-500",
  },
  {
    title: "Transfer",
    url: "/transactions/transfer",
    icon: ArrowRightLeft,
    color: "text-sky-500",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-slate-800 bg-slate-950" {...props}>
      <SidebarHeader className="border-b border-slate-800 p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-50 group-data-[collapsible=icon]:hidden">
            Vault Pro
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="hover:bg-slate-900"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    tooltip={item.title}
                    className="hover:bg-slate-900"
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
