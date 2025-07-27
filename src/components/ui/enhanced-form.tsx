'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
// import { useFormValidation } from '@/hooks/useFormValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

// Enhanced Input with validation
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    label, 
    error, 
    touched, 
    required, 
    showPasswordToggle, 
    leftIcon, 
    rightIcon, 
    helperText,
    className,
    type = 'text',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const hasError = touched && error;

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={props.id || props.name}
            className={cn(
              'text-sm font-medium',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              hasError && 'text-red-600'
            )}
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <Input
            ref={ref}
            type={inputType}
            className={cn(
              'transition-all duration-200',
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle) && 'pr-10',
              hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              isFocused && !hasError && 'border-blue-500 ring-2 ring-blue-500/20',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle && type === 'password' ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {(hasError || helperText) && (
          <div className="flex items-start gap-1 text-sm">
            {hasError && <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
            <span className={hasError ? 'text-red-600' : 'text-gray-500'}>
              {hasError ? error : helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// Enhanced Textarea with validation
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export const EnhancedTextarea = forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ 
    label, 
    error, 
    touched, 
    required, 
    helperText, 
    showCharCount,
    maxLength,
    className,
    ...props 
  }, ref) => {
    const hasError = touched && error;
    const charCount = (props.value as string)?.length || 0;

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={props.id || props.name}
            className={cn(
              'text-sm font-medium',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              hasError && 'text-red-600'
            )}
          >
            {label}
          </Label>
        )}
        
        <Textarea
          ref={ref}
          className={cn(
            'transition-all duration-200 resize-none',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          maxLength={maxLength}
          {...props}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {(hasError || helperText) && (
              <div className="flex items-start gap-1 text-sm">
                {hasError && <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
                <span className={hasError ? 'text-red-600' : 'text-gray-500'}>
                  {hasError ? error : helperText}
                </span>
              </div>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <span className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400',
              charCount >= maxLength && 'text-red-500'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';

// Enhanced Select with validation
interface EnhancedSelectProps {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  error,
  touched,
  required,
  helperText,
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
  className,
}) => {
  const hasError = touched && error;

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          className={cn(
            'text-sm font-medium',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
            hasError && 'text-red-600'
          )}
        >
          {label}
        </Label>
      )}
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          className={cn(
            'transition-all duration-200',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(hasError || helperText) && (
        <div className="flex items-start gap-1 text-sm">
          {hasError && <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
          <span className={hasError ? 'text-red-600' : 'text-gray-500'}>
            {hasError ? error : helperText}
          </span>
        </div>
      )}
    </div>
  );
};

// Enhanced Checkbox with validation
interface EnhancedCheckboxProps {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helperText?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
  label,
  error,
  touched,
  required,
  helperText,
  checked,
  onCheckedChange,
  className,
  id,
}) => {
  const hasError = touched && error;

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(
            'mt-0.5',
            hasError && 'border-red-500',
            className
          )}
        />
        {label && (
          <Label 
            htmlFor={id}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              hasError && 'text-red-600'
            )}
          >
            {label}
          </Label>
        )}
      </div>
      
      {(hasError || helperText) && (
        <div className="flex items-start gap-1 text-sm ml-6">
          {hasError && <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
          <span className={hasError ? 'text-red-600' : 'text-gray-500'}>
            {hasError ? error : helperText}
          </span>
        </div>
      )}
    </div>
  );
};

// Enhanced Radio Group with validation
interface EnhancedRadioGroupProps {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const EnhancedRadioGroup: React.FC<EnhancedRadioGroupProps> = ({
  label,
  error,
  touched,
  required,
  helperText,
  options,
  value,
  onValueChange,
  className,
  orientation = 'vertical',
}) => {
  const hasError = touched && error;

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          className={cn(
            'text-sm font-medium',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
            hasError && 'text-red-600'
          )}
        >
          {label}
        </Label>
      )}
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2',
          className
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={option.value}
              disabled={option.disabled}
              className={hasError ? 'border-red-500' : ''}
            />
            <Label 
              htmlFor={option.value}
              className={cn(
                'text-sm font-normal',
                option.disabled && 'opacity-50 cursor-not-allowed',
                hasError && 'text-red-600'
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {(hasError || helperText) && (
        <div className="flex items-start gap-1 text-sm">
          {hasError && <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
          <span className={hasError ? 'text-red-600' : 'text-gray-500'}>
            {hasError ? error : helperText}
          </span>
        </div>
      )}
    </div>
  );
};

// Enhanced Form wrapper
interface EnhancedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  isSubmitting?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

export const EnhancedForm: React.FC<EnhancedFormProps> = ({
  children,
  isSubmitting,
  onSubmit,
  className,
  ...props
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn('space-y-6', className)}
      {...props}
    >
      <fieldset disabled={isSubmitting} className="space-y-6">
        {children}
      </fieldset>
    </form>
  );
};

// Enhanced Submit Button
interface EnhancedSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const EnhancedSubmitButton: React.FC<EnhancedSubmitButtonProps> = ({
  isSubmitting,
  loadingText = 'Submitting...',
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting}
      className={cn('w-full', className)}
      {...props}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? loadingText : children}
    </Button>
  );
};

// Form Section wrapper
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};