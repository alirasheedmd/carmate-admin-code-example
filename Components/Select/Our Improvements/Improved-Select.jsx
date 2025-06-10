import { useState, useRef, useEffect } from 'react'
import { SelectArrow } from '@/assets/icons'
import { cn } from '@/lib/utils'

interface SelectProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
  error?: string
  required?: boolean
  label?: string
  id?: string
}

export const SelectB = ({
  options,
  value: initialValue,
  onChange,
  placeholder = 'Select',
  className = '',
  disabled = false,
  name,
  error,
  required = false,
  label,
  id,
}: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState(initialValue || '')

  useEffect(() => {
    if (initialValue !== undefined) {
      setSelectedValue(initialValue)
    }
  }, [initialValue])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setSelectedValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-primary-white">
          {label}
          {required && <span className="text-alert-red">*</span>}
        </label>
      )}

      <div className="relative">
        {name && <input type="hidden" name={name} value={selectedValue} />}

        <select
          id={id}
          name={name}
          value={selectedValue}
          onChange={handleSelectChange}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full rounded-lg border text-xbase font-normal px-4 py-4 appearance-none',
            error ? 'border-alert-red' : 'border-border-dark',
            disabled
              ? 'bg-border-dark cursor-not-allowed text-muted-gray'
              : 'bg-panel-dark cursor-pointer text-primary-white',
            !selectedValue && 'text-steel-gray'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className={disabled ? 'text-muted-gray' : ''}
            >
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <SelectArrow />
        </div>
      </div>

      {error && <div className="text-alert-red text-xs mt-1">{error}</div>}
    </div>
  )
}
