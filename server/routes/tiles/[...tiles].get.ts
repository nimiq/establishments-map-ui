import type { LayerFeature } from '~~/types/layers'
import type { MapViewport, Markers } from '~~/types/map'
import type { Database } from '~~/types/supabase'
import type { Point } from 'geojson'
import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { tileToBBOX } from '@mapbox/tilebelt'
import { feature, geometry } from '@turf/turf'
import { createError } from 'h3'
import { object, pipe, rawTransform, safeParse, string } from 'valibot'

const PathSchema = object({
  tiles: pipe(
    string(),
    rawTransform(({ dataset: str, addIssue }) => {
      const [z, x, y] = str.value.split('/').map(Number)
      if (z === undefined || x === undefined || y === undefined || Number.isNaN(z) || Number.isNaN(x) || Number.isNaN(y))
        return addIssue({ expected: 'z/x/y as numbers' })
      return { z, x, y }
    }),
  ),
})

// http://localhost:3000/tiles/7/66/43

export default defineEventHandler(async (event) => {
  const { output: coords, issues, success } = await getValidatedRouterParams(event, query => safeParse(PathSchema, query))
  if (!success || !coords)
    throw createError({ statusCode: 400, message: 'Invalid query parameters', cause: JSON.stringify(issues) })

  const { x, y, z } = coords.tiles!

  // const [nelng, nelat, swlng, swlat] = tileToBBOX([x, y, z])
  // const featureCollection = await fetchLayerData(event, { boundingBox: { nelat, nelng, swlat, swlng }, zoom: z })
  // const tileIndex = geojsonvt(featureCollection)
  // const tile = tileIndex.getTile(z, x, y)

  // const buffer = Buffer.from(vtpbf.fromGeojsonVt({ geojsonLayer: tile }))
  // setHeader(event, 'Content-Type', 'application/protobuf')
  // return buffer

  const key = `tile:${z}:${x}:${y}` as const
  const kv = hubKV()

  const [nelng, nelat, swlng, swlat] = tileToBBOX([x, y, z])
  const featureCollection = await fetchLayerData(event, { boundingBox: { nelat, nelng, swlat, swlng }, zoom: z })
  return featureCollection
  // let pbfBuffer: Buffer

  if (await kv.has(key) && false) {
    // const base64String = await kv.get(key) as string
    // pbfBuffer = Buffer.from(base64String, 'base64')
  }
  else {
    // pbfBuffer = Buffer.from(geobuf.encode(featureCollection, new (Pbf as any)()))
    // await kv.set(key, pbfBuffer.toString('base64'))
  }

  // setHeader(event, 'Content-Type', 'application/x-protobuf')
  // return pbfBuffer
})

// function tileToBBox(x: number, y: number, z: number) {
//   const sinh = (arg: number) => (Math.exp(arg) - Math.exp(-arg)) / 2
//   const lng = x * 360 / 2 ** z - 180
//   const lat = Math.atan(Math.sinh(Math.PI - y * 2 * Math.PI / 2 ** z)) * (180 / Math.PI)

//   return { nelat, nelng, swlat, swlng }
// }

async function fetchLayerData(event: H3Event, { boundingBox, zoom }: MapViewport): Promise<LayerFeature> {
  // Get the markers from the database
  const supabase = await serverSupabaseClient<Database>(event)
  const { data: markers, error } = await supabase.rpc('get_markers', { ...boundingBox, zoom_level: zoom }) as { data: Markers | null, error: any }
  if (error || !markers)
    throw createError({ statusCode: 500, message: 'Failed to fetch data', cause: error?.message || 'Unknown error' })

  // Convert the markers to GeoJSON features
  const singlesFeatures = markers.singles.map(({ lat, lng, name }) => feature(geometry('Point', [lng, lat]) as Point, { kind: 'single', name } as const))
  const clustersFeatures = markers.clusters.map(({ lat, lng, ...properties }) => feature(geometry('Point', [lng, lat]) as Point, { kind: 'cluster', ...properties } as const))
  const crs = {
    type: 'name',
    properties: {
      name: 'EPSG:3857',
    },
  }
  return { type: 'FeatureCollection', features: [...singlesFeatures, ...clustersFeatures], crs }
}
