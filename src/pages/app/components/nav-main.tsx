import { StoreIcon, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userStores"],
    queryFn: getUserStores,
  });

  async function getUserStores() {
    const res = await api.get("/stores/mine");
    return res.data;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Select defaultValue={stores?.[0]?.slug}>
              <SelectTrigger className="w-full h-8 ">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {stores?.map((store: any) => (
                    <SelectItem key={store.id} value={store.slug}>
                      <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                        <Avatar className="size-6 rounded bg-transparent">
                          <AvatarImage src={store.icon} alt={store.name} />
                          <AvatarFallback className="bg-transparent">
                            <StoreIcon />
                          </AvatarFallback>
                        </Avatar>
                        {store.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
