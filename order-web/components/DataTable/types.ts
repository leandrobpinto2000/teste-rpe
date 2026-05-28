import type { ColumnDef } from '@tanstack/react-table';

export type { ColumnDef };

export type ActionsRenderer<T> = (row: T) => React.ReactNode;
