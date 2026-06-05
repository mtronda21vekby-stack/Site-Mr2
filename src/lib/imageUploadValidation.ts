export const SUPPORTED_UPLOAD_IMAGE_TYPES = new Set(['image/png', 'image/webp', 'image/svg+xml', 'image/jpeg'])

export function isHeicLikeFile(file: { name: string; type?: string }) {
  const lowerName = file.name.toLowerCase()
  const lowerType = String(file.type || '').toLowerCase()

  return (
    lowerName.endsWith('.heic') ||
    lowerName.endsWith('.heif') ||
    lowerType === 'image/heic' ||
    lowerType === 'image/heif'
  )
}

function hasPrefix(bytes: Uint8Array, prefix: number[]) {
  return prefix.every((value, index) => bytes[index] === value)
}

function hasWebpSignature(bytes: Uint8Array) {
  const text = new TextDecoder().decode(bytes.slice(0, 12))
  return text.startsWith('RIFF') && text.slice(8, 12) === 'WEBP'
}

function hasSvgSignature(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes).toLowerCase().includes('<svg')
}

export async function hasMatchingImageSignature(file: Blob & { type: string }) {
  const bytes = new Uint8Array(await file.slice(0, 512).arrayBuffer())

  if (file.type === 'image/png') return hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47])
  if (file.type === 'image/jpeg') return hasPrefix(bytes, [0xff, 0xd8, 0xff])
  if (file.type === 'image/webp') return hasWebpSignature(bytes)
  if (file.type === 'image/svg+xml') return hasSvgSignature(bytes)

  return false
}
