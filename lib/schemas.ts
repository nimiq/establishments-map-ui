import { intersect, maxValue, minValue, number, object, pipe, rawTransform, transform, string, uuid, unknown } from 'valibot'

export const UuidSchema = pipe(string(), uuid('The UUID is badly formatted'))
export const UuidObjectSchema = object({ uuid: UuidSchema })

export const LatSchema = pipe(unknown(), transform(Number), minValue(-90, 'Latitude must be greater than or equal to -90'), maxValue(90, 'Latitude must be less than or equal to 90'))
export const LngSchema = pipe(unknown(), transform(Number), minValue(-180, 'Longitude must be greater than or equal to -180'), maxValue(180, 'Longitude must be less than or equal to 180'))
export const BoundingBoxSchema = object({ nelat: LatSchema, nelng: LngSchema, swlat: LatSchema, swlng: LngSchema })
export const BoundingBoxObjectSchema = object({ boundingBox: BoundingBoxSchema })
export const BoundingBoxStrSchema = pipe(string(), rawTransform(({ dataset: str, addIssue }) => {
  const [nelat, nelng, swlat, swlng] = str.value.split(',').map(Number)
  if (!nelat || !nelng || !swlat || !swlng)
    return addIssue({ expected: 'nelat,nelng,swlat,swlng' })
  return { nelat, nelng, swlat, swlng }
}))

export const ZoomSchema = pipe(
  unknown(), transform(Number),
  minValue(0, 'Zoom level must be greater than or equal to 0'),
  maxValue(21, 'Zoom level must be less than or equal to 21'),
)
export const ZoomObjectSchema = object({ zoom: ZoomSchema })

export const MapViewportSchema = intersect([BoundingBoxStrSchema, ZoomObjectSchema])
