"use client";

import React from "react";
import { Sidebar } from "../ui/sidebar/sidebar";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Stethoscope,
  Wallet,
  BarChart,
  FileText,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import Logo from "./logo";
import { usePathname } from "next/navigation";

const sidebarItemsBase = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Orders & Delivery",
    href: "/orders-delivery",
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: "Product Mgt.",
    href: "/product-mgt",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    label: "Clinical Support",
    href: "/clinical-support",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    label: "Financial",
    href: "/financial",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    label: "Content Edit",
    href: "/content-edit",
    icon: <FileText className="w-5 h-5" />,
  },
  { label: "Admin", href: "/admin", icon: <Settings className="w-5 h-5" /> },
];

const SidebarBrand = (
  <div className="flex items-center space-x-2">
    <Logo />
  </div>
);

const SidebarUser = (
  <div className="flex items-center p-3 rounded-md bg-gray-50 mt-4 mx-2">
    <User className="w-5 h-5 mr-2" />
    <div>
      <div className="font-medium">Samuel Ekanem</div>
      <div className="text-xs text-gray-500">
        Admin User <ChevronDown className="inline w-3 h-3" />
      </div>
    </div>
  </div>
);

const GeneralLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const sidebarItems = sidebarItemsBase.map((item) => ({
    ...item,
    active: item.href === pathname,
  }));

  return (
    <div className="flex justify-between h-screen overflow-y-auto w-full">
      <Sidebar brand={SidebarBrand} items={sidebarItems}>
        <div className="mt-auto">{SidebarUser}</div>
      </Sidebar>
      <main className="relative flex-1">{children}</main>
    </div>
  );
};

export default GeneralLayout;
