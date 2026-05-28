'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import type { ActionsRenderer } from './types';

const ACTIONS_COLUMN_ID = '__actions';

type Props<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  actions?: ActionsRenderer<T>;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
};

export function DataTable<T>({
  columns,
  data,
  actions,
  emptyMessage = 'Sem registros para exibir.',
  isLoading = false,
  className,
}: Props<T>) {
  const finalColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
    if (!actions) return columns;
    const actionsColumn: ColumnDef<T, unknown> = {
      id: ACTIONS_COLUMN_ID,
      header: () => <span className="block text-right">Ações</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">{actions(row.original)}</div>
      ),
    };
    return [...columns, actionsColumn];
  }, [columns, actions]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const colSpan = finalColumns.length;
  const hasRows = data.length > 0;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-navy-100 bg-white shadow-card',
        className,
      )}
    >
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-brand-500 bg-navy-800 text-xs uppercase tracking-wider text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className={cn(
                    'px-4 py-3 font-semibold',
                    header.column.id === ACTIONS_COLUMN_ID ? 'text-right' : 'text-left',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-navy-100 text-navy-800">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                <td colSpan={colSpan} className="px-4 py-4">
                  <div className="h-4 w-full animate-pulse rounded bg-navy-100" />
                </td>
              </tr>
            ))
          ) : !hasRows ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-8 text-center text-navy-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className={cn(rowIndex % 2 === 1 && 'bg-navy-50/50')}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-3 align-middle',
                      cell.column.id === ACTIONS_COLUMN_ID && 'text-right',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
