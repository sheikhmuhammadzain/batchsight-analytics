import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type BatchRecord = Record<string, string | number | null | undefined>

export function BatchTable({ data }: { data: BatchRecord[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          No batch records available.
        </div>
      </div>
    )
  }

  const columns = [
    "FORMULA_ID",
    "SCRAP_FACTOR",
    "ROUTING_ID",
    "WIP_BATCH_ID",
    "WIP_BATCH_NO",
    "WIP_ACT_START_DATE",
    "WIP_CMPLT_DATE",
    "BATCH_CLOSE_DATE",
    "LINE_NO",
    "WIP_TYPE",
    "TRANSACTION_TYPE_NAME",
    "INVENTORY_ITEM_ID",
    "TRANSACTION_UOM",
    "PLAN_QTY",
    "ORIGINAL_QTY",
    "WIP_QTY",
    "WIP_PERIOD_NAME",
    "WIP_RATE",
    "WIP_VALUE",
    "WIP_BATCH_STATUS",
    "WIP_LOT_NUMBER",
    "REASON",
    "RESOURC",
  ]

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border bg-card overflow-x-auto max-w-full">
        <Table className="min-w-[1200px]">
          <TableCaption>WIP Batch Transactions</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c} className="whitespace-nowrap">{c.replace(/_/g, " ")}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((c) => {
                  const value = row[c]
                  const display = typeof value === "number" ? value.toLocaleString() : (value ?? "")
                  return (
                    <TableCell key={c} className="whitespace-nowrap text-xs">{display as any}</TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


