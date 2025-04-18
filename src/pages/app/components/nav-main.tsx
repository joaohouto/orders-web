import {
  CogIcon,
  NotebookText,
  Package,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { StoreSelector } from "./store-selector";
import { NavLink, useParams } from "react-router";
import { useState } from "react";

export function NavMain() {
  const { storeSlug } = useParams();

  const [currentStore, setCurrentStore] = useState({
    id: "",
    icon: "",
    name: "",
    slug: "",
    role: "",
  });

  const baseItems = [
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
  ];

  const ownerOnlyItems = [
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
  ];

  const items =
    currentStore.role === "OWNER"
      ? [...baseItems, ...ownerOnlyItems]
      : baseItems;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <StoreSelector
              onChangeCurrentStore={(store) => setCurrentStore(store)}
            />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={false} tooltip={item.title} asChild>
                <NavLink to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
