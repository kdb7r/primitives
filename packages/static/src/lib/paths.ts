import path from 'node:path'

// Used as an optimization to avoid dual lookups for missing assets
const assetExtensionRegExp = /\.(html?|png|jpg|js|css|svg|gif|ico|woff|woff2)$/

// Helper function to ensure resolved path is within base directory
const isPathInsideBase = (resolvedPath: string, baseDirectory: string) => {
  const relative = path.relative(baseDirectory, resolvedPath)
  // path.relative returns a path starting with '..' if resolvedPath is outside baseDirectory
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

export const getFilePathsForURL = (pathname: string, baseDirectory = '') => {
  const urlVariations = getURLVariations(pathname)
  const possiblePaths = urlVariations.map((urlVariation) => {
    const parts = urlVariation.split('/').filter(Boolean)
    const resolvedPath = path.resolve(baseDirectory, ...parts)

    if (!isPathInsideBase(resolvedPath, baseDirectory)) {
      // If path traversal detected, ignore this path
      return null
    }

    return resolvedPath
  }).filter(Boolean) as string[]

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
