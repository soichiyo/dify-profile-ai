import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export type IButtonProps = {
  variant?: Variant
  // legacy prop support (maps to variant)
  type?: string
  size?: Size
  block?: boolean
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  htmlType?: 'button' | 'submit' | 'reset'
}

const Button: FC<IButtonProps> = ({
  variant,
  type: legacyType,
  size = 'md',
  block = false,
  disabled,
  children,
  className = '',
  onClick,
  loading = false,
  htmlType = 'button',
}) => {
  const v: Variant = (variant || (legacyType as Variant) || 'secondary')

  const base = [
    'inline-flex items-center justify-center select-none',
    'rounded-lg font-medium transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30',
    block ? 'w-full' : 'w-auto',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ')

  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  const variants: Record<Variant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-600/90',
    secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-primary-600 hover:opacity-80',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      type={htmlType}
      className={`${base} ${sizes[size]} ${variants[v]} ${className}`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {children}
      <Spinner loading={loading} className='!text-current !h-3 !w-3 !border-2 !ml-1' />
    </button>
  )
}

export default React.memo(Button)
