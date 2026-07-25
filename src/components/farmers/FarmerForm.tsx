'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { farmerApi, tenantFieldApi } from '@/lib/api-client';
import { DynamicForm, FieldConfig } from '@/components/forms/DynamicForm';
import { useCreateFarmer, useUpdateFarmer } from '@/hooks/useFarmers';
import toast from 'react-hot-toast';

interface FarmerFormProps {
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
}

export function FarmerForm({ mode = 'create', onSuccess }: FarmerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFarmer = useCreateFarmer();
  const updateFarmer = useUpdateFarmer();

  // Fetch tenant fields for dynamic form
  const { data: fieldsData, isLoading: fieldsLoading } = useQuery({
    queryKey: ['tenantFields'],
    queryFn: () => tenantFieldApi.list(),
  });

  // Fetch farmer profile if editing
  const { data: farmerData } = useQuery({
    queryKey: ['farmer', 'profile'],
    queryFn: () => farmerApi.getProfile(),
    enabled: mode === 'edit',
  });

  const dynamicFields: FieldConfig[] = fieldsData?.data?.length
    ? fieldsData.data.map((f: any) => ({
        fieldKey: f.fieldKey || f.key,
        label: f.label,
        fieldType: f.fieldType || 'text',
        options: f.options,
        required: f.required || false,
        placeholder: f.placeholder || `Enter ${f.label}`,
      }))
    : [];

  // Default static fields
  const staticFields: FieldConfig[] = [
    { fieldKey: 'name', label: 'Full Name', fieldType: 'text', required: true, placeholder: 'Enter your full name' },
    { fieldKey: 'phone', label: 'Phone Number', fieldType: 'phone', required: true, placeholder: '+1234567890' },
    { fieldKey: 'address', label: 'Address', fieldType: 'text', required: false, placeholder: 'Enter your address' },
    { fieldKey: 'city', label: 'City', fieldType: 'text', required: false, placeholder: 'Enter your city' },
    { fieldKey: 'state', label: 'State/Province', fieldType: 'text', required: false, placeholder: 'Enter your state' },
    { fieldKey: 'dateOfBirth', label: 'Date of Birth', fieldType: 'date', required: false },
  ];

  const allFields = [...staticFields, ...dynamicFields];

  const defaultValues = mode === 'edit' && farmerData?.data
    ? farmerData.data
    : {};

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await createFarmer.mutateAsync(data);
      } else {
        await updateFarmer.mutateAsync(data);
      }
      toast.success(`Farmer profile ${mode === 'create' ? 'created' : 'updated'} successfully`);
      onSuccess?.();
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fieldsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DynamicForm
      fields={allFields}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitLabel={mode === 'create' ? 'Create Profile' : 'Update Profile'}
      isSubmitting={isSubmitting}
    />
  );
}
