"use client";

import * as React from "react";
import { FolderOpen, KeyIcon, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Workflows",
      url: "/workflows",
      icon: FolderOpen,
      isActive: true,
    },
    {
      title: "Credentials",
      url: "/credentials",
      icon: KeyIcon,
    },
    {
      title: "Executions",
      url: "/executions",
      icon: SquareTerminal,
    },
  ],
};

function SidebarContent_({ items }: { items: typeof data.navMain }) {
  const { data: session } = useSession();

  const userData = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    avatar: session?.user?.image || "/avatars/shadcn.jpg",
  };

  return (
    <>
      <SidebarHeader className="flex items-center mb-12 mt-6">
        <Image src={"/logo.svg"} alt="Logo" width={120} height={120} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent_ items={data.navMain} />
    </Sidebar>
  );
}
