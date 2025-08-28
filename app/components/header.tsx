import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import LogoIcon from '@/app/components/base/logo-icon'
import Button from '@/app/components/base/button'
export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100">
      {isMobile
        ? (
          <Button
            aria-label="Open sidebar"
            size='sm'
            variant='ghost'
            className='h-9 w-9 p-0 rounded-md'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5 text-gray-500" />
          </Button>
        )
        : <div className="w-9" />}
      <div className='flex items-center gap-2'>
        <LogoIcon size="small" />
        <div className="text-sm font-semibold text-gray-900 tracking-tight">{title}</div>
      </div>
      {isMobile
        ? (
          <Button
            aria-label="New chat"
            size='sm'
            variant='ghost'
            className='h-9 w-9 p-0 rounded-md'
            onClick={() => onCreateNewChat?.()}
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-500" />
          </Button>)
        : <div className="w-9" />}
    </div>
  )
}

export default React.memo(Header)
