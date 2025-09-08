"use client"

import { SidebarTrigger } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Download } from "lucide-react"
import React from "react"
import { exportAllDataToCSV, triggerDownload } from "@/lib/export"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const [exporting, setExporting] = React.useState(false)
  const { toast } = useToast()
  const [notifications, setNotifications] = React.useState<
    { id: string; title: string; description?: string; read?: boolean; time?: string }[]
  >([
    { id: "1", title: "Delayed batches spike on Line 7", description: "Delay rate 31% today", read: false, time: "2m" },
    { id: "2", title: "Monthly export ready", description: "Generated at 10:15 AM", read: true, time: "1h" },
    { id: "3", title: "Scrap factor above target on Line 3", description: "3.4% vs 3%", read: false, time: "3h" },
  ])

  const handleExport = async () => {
    try {
      setExporting(true)
      const { url, filename } = await exportAllDataToCSV()
      // Trigger immediate download
      triggerDownload(url, filename)

      // Show toast with a download link (in case user wants to re-download)
      toast({
        title: "Export ready",
        description: (
          <span>
            Your CSV has been generated. If the download didn’t start, <a href={url} download={filename} className="underline text-primary">click here</a>.
          </span>
        ),
      })

      // Revoke link after some time to free memory
      setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000)
    } catch (err) {
      console.error("Export failed", err)
      toast({
        title: "Export failed",
        description: "We couldn't generate the CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }
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
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleExport} disabled={exporting}>
            <Download className="mr-2 size-4" />
            {exporting ? "Exporting…" : "Export"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
                <Bell className="size-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-destructive" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
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
        </div>
      </div>
    </header>
  )
}


