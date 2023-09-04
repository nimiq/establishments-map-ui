import type { BoundingBox, Point } from './types'

export function isBoxWithinBox(inBox: BoundingBox, outerBox: BoundingBox): boolean {
  const { neLat: neLatIn, neLng: neLngIn, swLat: swLatIn, swLng: swLngIn } = inBox
  const { neLat: neLatOut, neLng: neLngOut, swLat: swLatOut, swLng: swLngOut } = outerBox

  // Handling anti-meridian
  return swLngOut > neLngOut
    ? (swLatIn >= swLatOut && neLatIn <= neLatOut && (swLngIn >= swLngOut || neLngIn <= neLngOut))
    : (swLatIn >= swLatOut && neLatIn <= neLatOut && swLngIn >= swLngOut && neLngIn <= neLngOut)
}

export function isPointWithinBoundingBox(bbox: BoundingBox, point: Point): boolean {
  const { lat, lng } = point
  const { neLat, neLng, swLat, swLng } = bbox

  // Handling anti-meridian
  return swLng > neLng
    ? (lat >= swLat && lat <= neLat && (lng >= swLng || lng <= neLng))
    : (lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng)
}
