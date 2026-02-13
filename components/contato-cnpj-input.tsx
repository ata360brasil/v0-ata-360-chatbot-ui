'use client'

import { useState } from 'react'
import { maskCNPJ, validateCNPJ } from '@/lib/masks'

export function ContatoCnpjInput() {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)
  const masked = maskCNPJ(value)
  const isValid = !touched || value.length === 0 || validateCNPJ(masked)

  return (
    <div>
      <input
        type="text"
        id="cnpj"
        name="cnpj"
        required
        placeholder="00.000.000/0001-00"
        value={masked}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={!isValid}
        className={`w-full rounded-md border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
          !isValid ? 'border-destructive focus:ring-destructive/50' : 'border-input focus:ring-ring'
        }`}
      />
      {!isValid && (
        <p className="text-[10px] text-destructive mt-1">CNPJ invalido (digitos verificadores)</p>
      )}
    </div>
  )
}
