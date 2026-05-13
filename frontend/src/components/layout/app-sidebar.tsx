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
    <Sidebar collapsible="icon" className="border-border bg-background/50 backdrop-blur-xl" {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 font-bold text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold tracking-tight text-white">
              Vault Pro
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80">
              Core System
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-2 px-4">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={`h-11 px-4 rounded-xl transition-all duration-200 ${
                      pathname === item.url 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${pathname === item.url ? "text-primary" : ""}`} />
                    <span className="font-semibold">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-2 px-4">Operational</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {actionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    tooltip={item.title}
                    className="h-11 px-4 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-semibold">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* System Status in Sidebar Footer */}
      <div className="mt-auto p-6 group-data-[collapsible=icon]:hidden">
         <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-slate-400">System Healthy</span>
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full w-3/4 bg-primary rounded-full" />
            </div>
         </div>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
