"use client"

import { SidebarTrigger } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Download } from "lucide-react"
import React from "react"
import { exportAllDataToCSV, triggerDownload } from "@/lib/export"
import { useToast } from "@/hooks/use-toast"

export function SiteHeader() {
  const [exporting, setExporting] = React.useState(false)
  const { toast } = useToast()

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
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}


