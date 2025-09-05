import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Row = {
  id: string
  customer: string
  status: "Success" | "Processing" | "Failed"
  email: string
  amount: number
}

export function DataTable({ data }: { data: Row[] }) {
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableCaption>Recent payments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span
                    className={
                      row.status === "Success"
                        ? "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : row.status === "Processing"
                        ? "inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400"
                        : "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400"
                    }
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{row.customer}</TableCell>
                <TableCell className="text-muted-foreground">{row.email}</TableCell>
                <TableCell className="text-right font-mono">${'{'}row.amount.toLocaleString(){'}'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


