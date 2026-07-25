'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FieldConfig {
  fieldKey: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'date' | 'file' | 'email' | 'phone' | 'textarea';
  options?: { label: string; value: string }[] | string[];
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
}

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => Promise<void> | void;
  defaultValues?: any;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export function DynamicForm({
  fields,
  onSubmit,
  defaultValues = {},
  submitLabel = 'Submit',
  isSubmitting = false,
  className,
  layout = 'vertical',
}: DynamicFormProps) {
  // Build Zod schema dynamically
  const schema = z.object(
    fields.reduce((acc, field) => {
      let validator: z.ZodTypeAny;

      switch (field.fieldType) {
        case 'number':
          validator = z.coerce.number();
          break;
        case 'email':
          validator = z.string().email('Invalid email address');
          break;
        case 'phone':
          validator = z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number');
          break;
        case 'date':
          validator = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
          break;
        default:
          validator = z.string();
      }

      if (field.required) {
        if (field.fieldType === 'number') {
          validator = (validator as z.ZodNumber).min(0, `${field.label} is required`);
        } else {
          validator = (validator as z.ZodString).min(1, `${field.label} is required`);
        }
      } else {
        validator = validator.optional();
      }

      acc[field.fieldKey] = validator;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  const getOptions = (field: FieldConfig): { label: string; value: string }[] => {
    if (!field.options) return [];
    return field.options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'space-y-4',
        layout === 'horizontal' && 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0',
        className
      )}
    >
      {fields.map((field) => {
        const hasError = !!errors[field.fieldKey];

        return (
          <div key={field.fieldKey} className="space-y-2">
            <Label htmlFor={field.fieldKey} className={hasError ? 'text-destructive' : ''}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Controller
              name={field.fieldKey}
              control={control}
              render={({ field: controllerField }) => {
                if (field.fieldType === 'select') {
                  return (
                    <Select
                      value={controllerField.value as string}
                      onValueChange={controllerField.onChange}
                    >
                      <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getOptions(field).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                if (field.fieldType === 'textarea') {
                  return (
                    <textarea
                      className={`flex min-h-[80px] w-full rounded-md border ${
                        hasError ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      {...controllerField}
                    />
                  );
                }

                return (
                  <Input
                    id={field.fieldKey}
                    type={
                      field.fieldType === 'number'
                        ? 'number'
                        : field.fieldType === 'date'
                        ? 'date'
                        : field.fieldType === 'email'
                        ? 'email'
                        : 'text'
                    }
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    className={hasError ? 'border-destructive' : ''}
                    {...controllerField}
                    value={controllerField.value as string}
                  />
                );
              }}
            />

            {hasError && (
              <p className="text-sm text-destructive">
                {errors[field.fieldKey]?.message as string}
              </p>
            )}
          </div>
        );
      })}

      <Button
        type="submit"
        className={layout === 'horizontal' ? 'md:col-span-2' : 'w-full'}
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}

