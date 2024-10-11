import type { MapLocation, MapPosition, Point } from 'types'

export function euclideanDistance({ lat: y1, lng: x1 }: Point, { lat: y2, lng: x2 }: Point) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

const earthCircumference = 40075017 // Earth's circumference at the equator in meters
export function metersToPx(meters: number, zoom: number, lat: number = 45) {
  const latRad = (lat * Math.PI) / 180 // Convert latitude to radians
  const metersPerPixel = (earthCircumference * Math.cos(latRad)) / (256 * 2 ** zoom) // Calculate meters per pixel
  return meters / metersPerPixel // Convert meters to pixels
}

export function getPixelCoords({ center: { lat, lng }, zoom }: MapPosition) {
  const scale = 2 ** zoom
  const pixelX = (lng + 180) / 360 * 256 * scale
  const rad = lat * (Math.PI / 180)
  const sinLatitude = Math.sin(rad)
  const pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * 256 * scale
  return { x: pixelX, y: pixelY }
}

export function isPointInViewport({ center, zoom, height, width }: MapPosition & { width: number, height: number }, { lat, lng }: MapLocation) {
  const centerCoords = getPixelCoords({ zoom, center })
  const pointCoords = getPixelCoords({ zoom, center: { lat, lng } })

  const halfV = width / 2
  const halfH = height / 2

  return pointCoords.x > (centerCoords.x - halfV)
    && pointCoords.x < (centerCoords.x + halfV)
    && pointCoords.y > (centerCoords.y - halfH)
    && pointCoords.y < (centerCoords.y + halfH)
}
