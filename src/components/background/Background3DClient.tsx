'use client'

import dynamic from 'next/dynamic'

const Background3DEngine = dynamic(() => import('@/components/background/Background3DEngine'), {
  ssr: false,
  loading: () => null,
})

export default function Background3DClient() {
  return <Background3DEngine />
}
