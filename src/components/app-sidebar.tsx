"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Activity,
  BarChart3,
  Bell,
  CalendarFold,
  ChevronRight,
  Home,
  Layers3,
  LineChart,
  Settings,
  UserRound,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  variant?: "sidebar" | "floating" | "inset"
}

export function AppSidebar({ variant = "sidebar", ...props }: AppSidebarProps) {
  const { pathname } = useLocation()
  return (
    <Sidebar variant={variant} {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 ">
          <div className="text-sm font-semibold"><img height={250} width={250} src="/bergerlogo.png" alt="" /></div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Dashboard">
                  <NavLink to="/">
                    <Home />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/analytics")} tooltip="Analytics">
                  <NavLink to="/analytics">
                    <BarChart3 />
                    <span>Analytics</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/trends")} tooltip="Trends">
                  <NavLink to="/trends">
                    <LineChart />
                    <span>Trends</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/performance")} tooltip="Performance">
                  <NavLink to="/performance">
                    <Activity />
                    <span>Performance</span>
                  </NavLink>
                </SidebarMenuButton>
                <SidebarMenuAction>
                  <ChevronRight className="size-4" />
                </SidebarMenuAction>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/performance/monthly"}>
                      <NavLink to="/performance/monthly">Monthly</NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/performance/quarterly"}>
                      <NavLink to="/performance/quarterly">Quarterly</NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/production")} tooltip="Production">
                  <NavLink to="/production">
                    <Layers3 />
                    <span>Production</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/schedules")} tooltip="Schedules">
                  <NavLink to="/schedules">
                    <CalendarFold />
                    <span>Schedules</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between rounded-md bg-sidebar-accent px-2 py-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-xs font-medium">Muhammad Awais</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Settings className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { SidebarInset, SidebarProvider, SidebarTrigger }


