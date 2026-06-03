import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-top-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  onReorder?: (orderedIds: string[]) => void;
  getRowId?: (row: TData) => string;
  showPagination?: boolean;
}

function SortableTableRow<TData>({
  row,
  onRowClick,
  showDragHandle,
}: {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
  showDragHandle: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={onRowClick ? "cursor-pointer" : ""}
      onClick={() => onRowClick?.(row.original)}
    >
      {showDragHandle && (
        <TableCell
          className="w-8 pr-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        </TableCell>
      )}
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          onClick={
            cell.column.id === "select" || cell.column.id === "actions"
              ? (e) => e.stopPropagation()
              : undefined
          }
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  onReorder,
  getRowId,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [localData, setLocalData] = React.useState<TData[]>(data);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const table = useReactTable({
    data: localData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: getRowId ? (row: TData) => getRowId(row) : undefined,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(showPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const sensors = useSensors(useSensor(PointerSensor));
  const canDrag = !!onReorder && !!getRowId && columnFilters.length === 0;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalData((items) => {
      const oldIndex = items.findIndex((item) => getRowId!(item) === active.id);
      const newIndex = items.findIndex((item) => getRowId!(item) === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      onReorder!(reordered.map((item) => getRowId!(item)));
      return reordered;
    });
  }

  const rows = table.getRowModel().rows;

  const tableBody = (
    <TableBody>
      {rows?.length ? (
        rows.map((row) => (
          <SortableTableRow
            key={row.id}
            row={row}
            onRowClick={onRowClick}
            showDragHandle={canDrag}
          />
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length + (canDrag ? 1 : 0)}
            className="h-24 text-center"
          >
            Sem resultados.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {canDrag && <TableHead className="w-8" />}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {canDrag ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rows.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {tableBody}
              </SortableContext>
            </DndContext>
          ) : (
            tableBody
          )}
        </Table>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}
