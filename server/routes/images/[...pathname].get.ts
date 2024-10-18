import { getLocation } from '~~/server/utils/cache-location'
import consola from 'consola'

export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  // if the request is for a location image, serve it from blob storage
  if (pathname.startsWith('location:')) {
    // if the location is not cached, fetch it from the KV store
    if (!hubKV().has(pathname) || !hubBlob().head(pathname)) {
      consola.info(`Location ${pathname} not cached, fetching from KV store`)
      const location = await getLocation(event, pathname)
      await cacheLocation(location)
    }
  }

  return hubBlob().serve(event, pathname)
})
