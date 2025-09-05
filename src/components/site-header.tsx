"use client"

import { SidebarTrigger } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Download } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-[--header-height] items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Dashboard</span>
          <span>/</span>
          <span>Overview</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <Input placeholder="Search…" className="w-[280px]" />
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}


