import { TableRow, TableCell } from "@/components/ui/table";

export function ModelsEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">No models found</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
