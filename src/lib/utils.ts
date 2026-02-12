export function isValidLocalImage(src: string | undefined): boolean {
  if (!src) return false
  return src.startsWith('/') && !src.startsWith('//')
}
