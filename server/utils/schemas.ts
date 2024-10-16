import { maxValue, minValue, number, object, pipe, string, uuid, coerce } from 'valibot'

export const UuidSchema = object({ uuid: pipe(string(), uuid('The UUID is badly formatted')) })

const LatSchema = pipe(coerce(string(), number()),, minValue(-90, 'Latitude must be greater than or equal to -90'), maxValue(90, 'Latitude must be less than or equal to 90'))
const LngSchema = pipe(coerce(string(), number()),, minValue(-180, 'Longitude must be greater than or equal to -180'), maxValue(180, 'Longitude must be less than or equal to 180'))
export const BoundingBoxSchema = object({ nelat: LatSchema, nelng: LngSchema, swlat: LatSchema,  swlng: LngSchema })

export const ZoomSchema = pipe(
  number(),
  minValue(0, 'Zoom level must be greater than or equal to 0'),
  maxValue(21, 'Zoom level must be less than or equal to 21'),
)
