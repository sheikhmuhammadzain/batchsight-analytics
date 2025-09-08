"use client"

import React from "react"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = React.useState<
    { id: string; title: string; description?: string; read?: boolean; time?: string }[]
  >([
    { id: "n1", title: "Data refresh completed", description: "Charts updated", read: false, time: "just now" },
    { id: "n2", title: "High delay on Line 10", description: "27% today", read: false, time: "10m" },
  ])
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
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 relative" aria-label="Notifications">
                  <Bell className="size-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={6} className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-6 text-sm text-muted-foreground text-center">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                      <div className="flex w-full items-center justify-between">
                        <span className={n.read ? "" : "font-medium"}>{n.title}</span>
                        {n.time ? <span className="text-[10px] text-muted-foreground">{n.time}</span> : null}
                      </div>
                      {n.description ? (
                        <span className="text-xs text-muted-foreground">{n.description}</span>
                      ) : null}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs flex items-center justify-between gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
                    Mark all as read
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setNotifications([])}>Clear</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSettingsOpen(true)} aria-label="Open settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>Personalize your BatchSight experience.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Toggle light/dark theme</p>
              </div>
              <Switch id="theme" checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive weekly summary emails</p>
              </div>
              <Switch id="notif" defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Close</Button>
            <Button onClick={() => setSettingsOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

export { SidebarInset, SidebarProvider, SidebarTrigger }


