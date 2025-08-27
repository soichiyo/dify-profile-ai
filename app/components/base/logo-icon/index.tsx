import React from 'react'
import cn from 'classnames'

type LogoIconProps = {
  size?: 'xs' | 'small' | 'medium' | 'large'
  className?: string
}

const LogoIcon: React.FC<LogoIconProps> = ({
  size = 'medium',
  className,
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  const getLogoPath = (size: string) => {
    switch (size) {
      case 'xs':
        return '/icons/logo-small.png'
      case 'small':
        return '/icons/logo-small.png'
      case 'medium':
        return '/icons/logo-medium.png'
      case 'large':
        return '/icons/logo-large.png'
      default:
        return '/icons/logo-medium.png'
    }
  }

  return (
    <div className={cn(
      'flex items-center justify-center',
      sizeClasses[size],
      className,
    )}>
      <img
        src={getLogoPath(size)}
        alt="Prairie AI Logo"
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default LogoIcon
