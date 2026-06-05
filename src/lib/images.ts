type SupabaseImageOptions = {
  width: number
  height?: number
  quality?: number
  resize?: 'cover' | 'contain'
}

const objectPublicSegment = '/storage/v1/object/public/'
const unsupportedImagePattern = /\.(heic|heif)(?:[?#].*)?$/i
const vectorImagePattern = /\.svg(?:[?#].*)?$/i

export function isBrowserSupportedImageUrl(value: string) {
  return !unsupportedImagePattern.test(value.trim())
}

export function getOptimizedSupabaseImageUrl(value: string, options: SupabaseImageOptions) {
  const rawUrl = value.trim()
  if (!rawUrl || vectorImagePattern.test(rawUrl) || !isBrowserSupportedImageUrl(rawUrl)) return rawUrl

  try {
    const url = new URL(rawUrl)
    if (!url.pathname.includes(objectPublicSegment)) return rawUrl

    const publicPath = url.pathname.split(objectPublicSegment)[1]
    if (!publicPath) return rawUrl

    url.pathname = `/storage/v1/render/image/public/${publicPath}`
    url.search = ''
    url.searchParams.set('width', String(options.width))
    if (options.height) url.searchParams.set('height', String(options.height))
    url.searchParams.set('quality', String(options.quality ?? 76))
    url.searchParams.set('resize', options.resize ?? 'cover')

    return url.toString()
  } catch {
    return rawUrl
  }
}
