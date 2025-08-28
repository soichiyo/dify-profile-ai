'use client'
import React from 'react'

export enum MediaType {
  mobile = 'mobile',
  tablet = 'tablet',
  pc = 'pc',
}

const useBreakpoints = () => {
  const [width, setWidth] = React.useState(globalThis.innerWidth)
  // Align with Tailwind defaults: sm=640, md=768, lg=1024
  const media = (() => {
    if (width < 640) return MediaType.mobile
    if (width < 1024) return MediaType.tablet
    return MediaType.pc
  })()

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return media
}

export default useBreakpoints
