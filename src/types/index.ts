// Re-export all types for convenient importing
export * from './user';
export * from './farmer';
export * from './policy';
export * from './claim';
export * from './tenant';
export * from './fraud';
export * from './billing';

// Shared utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
