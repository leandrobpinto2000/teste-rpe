'use client';

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from './Input';
import { cleanCpf, formatCpf } from '@/lib/cpf';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  error?: string;
  hint?: string;
};

export function CpfInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = '000.000.000-00',
  error,
  hint,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const raw = typeof field.value === 'string' ? field.value : '';
        return (
          <Input
            label={label}
            placeholder={placeholder}
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            value={formatCpf(raw)}
            onChange={(event) => field.onChange(cleanCpf(event.target.value).slice(0, 11))}
            onBlur={field.onBlur}
            error={error}
            hint={hint}
          />
        );
      }}
    />
  );
}
