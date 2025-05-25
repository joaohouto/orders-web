import * as React from "react";
import {
  ArrowUpCircleIcon,
  ArrowUpRight,
  ArrowUpRightFromCircleIcon,
  BarChartIcon,
  Bird,
  CameraIcon,
  ClipboardListIcon,
  CogIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GalleryHorizontalEnd,
  GalleryVertical,
  GalleryVerticalEnd,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  NotebookText,
  Package,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
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
    navMain: [
      {
        title: "Produtos",
        url: `/app/${storeSlug}/products`,
        icon: Package,
      },
      {
        title: "Pedidos",
        url: `/app/${storeSlug}/orders`,
        icon: NotebookText,
      },
      {
        title: "Colaboradores",
        url: `/app/${storeSlug}/team`,
        icon: UsersIcon,
      },
      {
        title: "Configurações",
        url: `/app/${storeSlug}/config`,
        icon: CogIcon,
      },
    ],
    navSecondary: [
      {
        title: "Veja a loja ao vivo",
        url: `/${storeSlug}`,
        icon: ArrowUpRight,
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
                <info.appIcon />
                <span className="text-base font-bold tracking-tighter">
                  {info.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
