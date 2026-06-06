'use client'

import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react'
import { getOptimizedSupabaseImageUrl } from '@/lib/images'

type ResilientSupabaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  widthHint: number
  quality?: number
  resize?: 'cover' | 'contain'
}

export default function ResilientSupabaseImage({
  src,
  widthHint,
  quality,
  resize,
  onError,
  ...props
}: ResilientSupabaseImageProps) {
  const optimizedSrc = useMemo(
    () => getOptimizedSupabaseImageUrl(src, { width: widthHint, quality, resize }),
    [quality, resize, src, widthHint],
  )
  const [currentSrc, setCurrentSrc] = useState(optimizedSrc)

  useEffect(() => {
    setCurrentSrc(optimizedSrc)
  }, [optimizedSrc])

  return (
    <img
      {...props}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== src) {
          setCurrentSrc(src)
        }
        onError?.(event)
      }}
    />
  )
}
