'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Text } from '@/components'
import { ShieldCheck } from 'lucide-react'
import './mfa.css'

export default function MFAPage() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }

    setCode(newCode)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')

    if (fullCode.length !== 6) {
      setError('Digite o código completo')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Código inválido')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      router.push('/abacaxi/dashboard')

    } catch {
      setError('Erro ao verificar código. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mfa-page">
      <div className="mfa-container">
        <div className="mfa-header">
          <div className="mfa-icon">
            <ShieldCheck size={32} />
          </div>
          <Text as="h1" size="xl" weight="bold" font="fraunces">
            Verificação
          </Text>
          <Text as="p" size="sm" variant="secondary">
            Digite o código de 6 dígitos enviado para seu email
          </Text>
        </div>

        <form className="mfa-form" onSubmit={handleSubmit}>
          {error && (
            <div className="mfa-error">
              <Text size="sm">{error}</Text>
            </div>
          )}

          <div className="mfa-code-inputs" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="mfa-code-input"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="form-submit">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
