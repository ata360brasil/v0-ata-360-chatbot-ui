'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
  maskDate,
  maskBRL,
  maskProcessNumber,
  autoValidate,
  type FieldType,
} from '@/lib/masks'

const MASK_FN: Record<string, (v: string) => string> = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  phone: maskPhone,
  cep: maskCEP,
  date: maskDate,
  brl: maskBRL,
  process: maskProcessNumber,
}

interface MaskedInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  mask: FieldType
  value: string
  onValueChange: (raw: string, masked: string) => void
  showValidation?: boolean
}

function MaskedInput({
  mask,
  value,
  onValueChange,
  showValidation = false,
  className,
  ...props
}: MaskedInputProps) {
  const [touched, setTouched] = React.useState(false)

  const maskFn = MASK_FN[mask]
  const masked = maskFn ? maskFn(value) : value

  const validation = showValidation && touched && value.length > 0
    ? autoValidate(masked, mask)
    : null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const applied = maskFn ? maskFn(raw) : raw
    onValueChange(raw, applied)
  }

  return (
    <div className="relative">
      <Input
        value={masked}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        aria-invalid={validation ? !validation.valid : undefined}
        className={cn(
          validation && !validation.valid && 'border-destructive focus-visible:ring-destructive/50',
          className,
        )}
        {...props}
      />
      {validation && !validation.valid && (
        <p className="text-[10px] text-destructive mt-1">{validation.message}</p>
      )}
    </div>
  )
}

export { MaskedInput }
