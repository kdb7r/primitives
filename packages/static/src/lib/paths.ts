import path from 'node:path'

// Used as an optimization to avoid dual lookups for missing assets
const assetExtensionRegExp = /\.(html?|png|jpg|js|css|svg|gif|ico|woff|woff2)$/

// Sanitize the pathname to prevent directory traversal
const sanitizePathname = (pathname: string): string | null => {
  // Normalize the path to remove .. and . segments
  const normalizedPath = path.posix.normalize(pathname)

  // Reject if normalized path attempts to go outside root
  if (normalizedPath.startsWith('..') || normalizedPath.includes('/../') || normalizedPath.includes('\..\')) {
    return null
  }

  // Ensure it starts with a slash
  if (!normalizedPath.startsWith('/')) {
    return null
  }

  return normalizedPath
}

export const getFilePathsForURL = (pathname: string, baseDirectory = '') => {
  const sanitizedPathname = sanitizePathname(pathname)
  if (sanitizedPathname === null) {
    // Return empty array if invalid pathname to prevent directory traversal
    return []
  }

  const urlVariations = getURLVariations(sanitizedPathname)
  const possiblePaths = urlVariations.map((urlVariation) => {
    const parts = urlVariation.split('/').filter(Boolean)

    return path.resolve.apply(null, [baseDirectory, ...parts])
  })

  return possiblePaths
}

export const getURLVariations = (pathname: string) => {
  const paths: string[] = []

  if (pathname.endsWith('/')) {
    const end = pathname.length - 1

    if (pathname !== '/') {
      paths.push(`${pathname.slice(0, end)}.html`, `${pathname.slice(0, end)}.htm`)
    }

    paths.push(`${pathname}index.html`, `${pathname}index.htm`)
  } else if (!assetExtensionRegExp.test(pathname)) {
    paths.push(`${pathname}.html`, `${pathname}.htm`, `${pathname}/index.html`, `${pathname}/index.htm`)
  }

  if (!paths.includes(pathname)) {
    return [pathname, ...paths]
  }

  return paths
}
