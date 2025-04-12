import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GalleryVertical,
  GalleryVerticalEnd,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  Package,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useParams } from "react-router";
import { info } from "@/config/app";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { storeSlug } = useParams();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Página",
        url: `/app/${storeSlug}`,
        icon: LayoutDashboardIcon,
      },
      {
        title: "Colaboradores",
        url: `/app/${storeSlug}/team`,
        icon: UsersIcon,
      },
      {
        title: "Produtos",
        url: `/app/${storeSlug}/products`,
        icon: Package,
      },
      {
        title: "Vendas",
        url: `/app/${storeSlug}/orders`,
        icon: BarChartIcon,
      },
    ],
    navSecondary: [
      {
        title: "Configurações",
        url: "/settings",
        icon: SettingsIcon,
      },
      {
        title: "Preciso de ajuda",
        url: "mailto:suporte@joaocouto.com",
        icon: HelpCircleIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/app">
                <GalleryVerticalEnd className="h-5 w-5" />
                <span className="text-base font-semibold">{info.appName}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
