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

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Select defaultValue="direitoaquidauana">
              <SelectTrigger className="w-full h-8 ">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="direitoaquidauana">
                    <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                      <Avatar className="size-6 rounded bg-transparent">
                        <AvatarImage
                          src="https://direitoaquidauana.vercel.app/icon"
                          alt=""
                        />
                        <AvatarFallback className="bg-transparent">
                          <StoreIcon />
                        </AvatarFallback>
                      </Avatar>
                      Direito Aquidauana
                    </div>
                  </SelectItem>
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
