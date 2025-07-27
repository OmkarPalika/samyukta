'use client';

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  reValidateMode?: 'onChange' | 'onBlur';
  defaultValues?: Partial<T>;
  onSubmit?: (data: T) => void | Promise<void>;
}

interface FormState<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  mode = 'onSubmit',
  reValidateMode = 'onChange',
  defaultValues = {},
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: defaultValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
    isDirty: false,
  });

  // Validate a single field
  const validateField = useCallback((name: keyof T, value: unknown): string | null => {
    try {
      // Validate the entire object with just this field
      schema.parse({ [name]: value } as Partial<T>);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Invalid value';
      }
      return 'Validation error';
    }
  }, [schema]);

  // Validate all fields
  const validateForm = useCallback((values: Partial<T>): ValidationError[] => {
    try {
      schema.parse(values);
      return [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
      }
      return [{ field: 'form', message: 'Validation failed' }];
    }
  }, [schema]);

  // Set field value
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const isDirty = JSON.stringify(newValues) !== JSON.stringify(defaultValues);
      
      const newErrors = { ...prev.errors };
      
      // Validate on change if mode is set
      if ((mode === 'onChange') || (prev.touched[name as string] && reValidateMode === 'onChange')) {
        const fieldError = validateField(name, value);
        if (fieldError) {
          newErrors[name as string] = fieldError;
        } else {
          delete newErrors[name as string];
        }
      }
      
      const isValid = Object.keys(newErrors).length === 0 && 
                     validateForm(newValues).length === 0;
      
      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        isValid,
        isDirty,
      };
    });
  }, [mode, reValidateMode, validateField, validateForm, defaultValues]);

  // Set field as touched
  const setTouched = useCallback((name: keyof T, touched = true) => {
    setFormState(prev => {
      const newTouched = { ...prev.touched, [name as string]: touched };
      const newErrors = { ...prev.errors };
      
      // Validate on blur if mode is set
      if (touched && (mode === 'onBlur' || reValidateMode === 'onBlur')) {
        const fieldError = validateField(name, prev.values[name]);
        if (fieldError) {
          newErrors[name as string] = fieldError;
        } else {
          delete newErrors[name as string];
        }
      }
      
      const isValid = Object.keys(newErrors).length === 0 && 
                     validateForm(prev.values).length === 0;
      
      return {
        ...prev,
        touched: newTouched,
        errors: newErrors,
        isValid,
      };
    });
  }, [mode, reValidateMode, validateField, validateForm]);

  // Set multiple values
  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => {
      const newValues = { ...prev.values, ...values };
      const isDirty = JSON.stringify(newValues) !== JSON.stringify(defaultValues);
      
      const newErrors = { ...prev.errors };
      
      // Validate changed fields if needed
      if (mode === 'onChange') {
        Object.keys(values).forEach(key => {
          const fieldError = validateField(key as keyof T, values[key as keyof T]);
          if (fieldError) {
            newErrors[key] = fieldError;
          } else {
            delete newErrors[key];
          }
        });
      }
      
      const isValid = Object.keys(newErrors).length === 0 && 
                     validateForm(newValues).length === 0;
      
      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        isValid,
        isDirty,
      };
    });
  }, [mode, validateField, validateForm, defaultValues]);

  // Set errors manually
  const setErrors = useCallback((errors: Record<string, string>) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
      isValid: Object.keys({ ...prev.errors, ...errors }).length === 0,
    }));
  }, []);

  // Clear errors
  const clearErrors = useCallback((fields?: string[]) => {
    setFormState(prev => {
      const newErrors = { ...prev.errors };
      
      if (fields) {
        fields.forEach(field => delete newErrors[field]);
      } else {
        Object.keys(newErrors).forEach(key => delete newErrors[key]);
      }
      
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0 && 
                validateForm(prev.values).length === 0,
      };
    });
  }, [validateForm]);

  // Reset form
  const reset = useCallback((values?: Partial<T>) => {
    const resetValues = values || defaultValues;
    setFormState({
      values: resetValues,
      errors: {},
      touched: {},
      isValid: validateForm(resetValues).length === 0,
      isSubmitting: false,
      isDirty: false,
    });
  }, [defaultValues, validateForm]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Validate all fields
      const validationErrors = validateForm(formState.values);
      
      if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {};
        validationErrors.forEach(error => {
          errorMap[error.field] = error.message;
        });
        
        setFormState(prev => ({
          ...prev,
          errors: errorMap,
          isValid: false,
          isSubmitting: false,
        }));
        
        return { success: false, errors: validationErrors };
      }
      
      // Parse and submit
      const validData = schema.parse(formState.values);
      
      if (onSubmit) {
        await onSubmit(validData);
      }
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isValid: true,
      }));
      
      return { success: true, data: validData };
      
    } catch (error) {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.issues.forEach(err => {
          errorMap[err.path.join('.')] = err.message;
        });
        
        setFormState(prev => ({
          ...prev,
          errors: errorMap,
          isValid: false,
        }));
        
        return { success: false, errors: error.issues };
      }
      
      throw error;
    }
  }, [formState.values, validateForm, schema, onSubmit]);

  // Get field props for easy integration
  const getFieldProps = useCallback((name: keyof T) => ({
    name: name as string,
    value: formState.values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(name, e.target.value);
    },
    onBlur: () => setTouched(name, true),
    error: formState.errors[name as string],
    touched: formState.touched[name as string],
  }), [formState, setValue, setTouched]);

  // Get checkbox props
  const getCheckboxProps = useCallback((name: keyof T) => ({
    name: name as string,
    checked: Boolean(formState.values[name]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, e.target.checked);
    },
    onBlur: () => setTouched(name, true),
    error: formState.errors[name as string],
    touched: formState.touched[name as string],
  }), [formState, setValue, setTouched]);

  // Watch for changes in specific fields
  const watch = useCallback((names?: (keyof T)[]): Partial<T> => {
    if (!names) return formState.values;
    
    const watchedValues: Partial<T> = {};
    names.forEach(name => {
      watchedValues[name] = formState.values[name];
    });
    
    return watchedValues;
  }, [formState.values]);

  // Trigger validation manually
  const trigger = useCallback(async (names?: (keyof T)[]): Promise<boolean> => {
    const fieldsToValidate = names || Object.keys(formState.values) as (keyof T)[];
    let hasErrors = false;
    const newErrors = { ...formState.errors };
    
    fieldsToValidate.forEach(name => {
      const error = validateField(name, formState.values[name]);
      if (error) {
        newErrors[name as string] = error;
        hasErrors = true;
      } else {
        delete newErrors[name as string];
      }
    });
    
    setFormState(prev => ({
      ...prev,
      errors: newErrors,
      isValid: !hasErrors && validateForm(prev.values).length === 0,
    }));
    
    return !hasErrors;
  }, [formState, validateField, validateForm]);

  // Effect to validate form on mount
  useEffect(() => {
    const isValid = validateForm(formState.values).length === 0;
    setFormState(prev => ({ ...prev, isValid }));
  }, [validateForm, formState.values]);

  return {
    // Form state
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    
    // Form methods
    setValue,
    setValues,
    setTouched,
    setErrors,
    clearErrors,
    reset,
    handleSubmit,
    trigger,
    watch,
    
    // Helper methods
    getFieldProps,
    getCheckboxProps,
    
    // Validation methods
    validateField,
    validateForm,
  };
}

// Hook for array fields (like team members)
export function useFieldArray<T extends Record<string, unknown>, K extends keyof T>(
  name: K,
  { control }: { control: ReturnType<typeof useFormValidation<T>> }
) {
  const fields = (control.values[name] as unknown[]) || [];
  
  const append = useCallback((value: unknown) => {
    const currentFields = control.values[name] as unknown[] || [];
    control.setValue(name, [...currentFields, value]);
  }, [control, name]);
  
  const remove = useCallback((index: number) => {
    const currentFields = control.values[name] as unknown[] || [];
    const newFields = currentFields.filter((_, i) => i !== index);
    control.setValue(name, newFields);
  }, [control, name]);
  
  const update = useCallback((index: number, value: unknown) => {
    const currentFields = control.values[name] as unknown[] || [];
    const newFields = [...currentFields];
    newFields[index] = value;
    control.setValue(name, newFields);
  }, [control, name]);
  
  const move = useCallback((from: number, to: number) => {
    const currentFields = control.values[name] as unknown[] || [];
    const newFields = [...currentFields];
    const [removed] = newFields.splice(from, 1);
    newFields.splice(to, 0, removed);
    control.setValue(name, newFields);
  }, [control, name]);
  
  return {
    fields,
    append,
    remove,
    update,
    move,
  };
}