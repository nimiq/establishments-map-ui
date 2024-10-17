import { integer, maxValue, minValue, object, pipe, string, transform, unknown, uuid } from 'valibot'

export const UuidSchema = pipe(string(), uuid('The UUID is badly formatted'))
export const UuidObjectSchema = object({ uuid: UuidSchema })

export const LatSchema = pipe(string(), transform(Number), minValue(-90, 'Latitude must be greater than or equal to -90'), maxValue(90, 'Latitude must be less than or equal to 90'))
export const LngSchema = pipe(string(), transform(Number), minValue(-180, 'Longitude must be greater than or equal to -180'), maxValue(180, 'Longitude must be less than or equal to 180'))
export const BoundingBoxSchema = object({ nelat: LatSchema, nelng: LngSchema, swlat: LatSchema, swlng: LngSchema })

export const ZoomSchema = pipe(
  unknown(),
  transform(Number),
  integer(),
  minValue(0, 'Zoom level must be greater than or equal to 0'),
  maxValue(21, 'Zoom level must be less than or equal to 21'),
)
