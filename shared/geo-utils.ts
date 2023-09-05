import bboxPolygon from '@turf/bbox-polygon'
import { type MultiPolygon, multiPoint, multiPolygon, point } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import booleanWithin from '@turf/boolean-within'
import pointsWithinPolygon from '@turf/points-within-polygon'
import union from '@turf/union'
import type { BoundingBox, Location, Point } from 'types'

/**
 * Returns a GeoJSON Point from a location. You can pass an object like a Location which will be stored as a property of the point
 * so you can retrieve it later
 */
export const toPoint = <T extends Point>(data: T) => point([data.lng, data.lat], data)

/**
 * Returns a GeoJSON Multipoint from a list of locations. You can pass an object like a Location which will be stored as a property of the multipoint
 */
export const toMultiPoint = <T extends Point>(data: T[]) => multiPoint(data.map(toPoint).map(d => d.geometry.coordinates), data)

/**
 * Converts a bounding box to a GeoJSON Polygon
 */
export const toPolygon = ({ swLat, neLat, neLng, swLng }: BoundingBox) => bboxPolygon([swLng, swLat, neLng, neLat])

/**
 * A mutlipolygon is a list of polygons.
 * In the following example, we have a multipolygon with two polygons:
┌───────────┐
│          │    ┌──────┐
│          └┐   │      │
│           │   └──────┘
└────────┐   │
        │   │
        └───┘
 */

/**
 * Converts a bounding box to a GeoJSON MultiPolygon
 */
export const toMultiPolygon = (bbox: BoundingBox) => multiPolygon([toPolygon(bbox).geometry.coordinates])

/**
 * Checks if a bounding box is within a multipolygon
 */
export const bBoxIsWithinArea = (bbox: BoundingBox, multiPoly?: MultiPolygon) => !multiPoly ? false : booleanWithin(toPolygon(bbox), multiPoly)

/**
 * Checks if a point is within a bounding box
 */
export const pointWithingBbox = ({ lat, lng }: Point, bbox: BoundingBox) => booleanPointInPolygon([lng, lat], toPolygon(bbox))

/**
 * Adds a polygon (from a bounding box) to a multipolygon
 */
export function addBBoxToArea(bbox: BoundingBox, multiPoly?: MultiPolygon) {
  return !multiPoly ? toMultiPolygon(bbox).geometry : union(multiPoly, toPolygon(bbox))?.geometry as MultiPolygon || multiPoly
}

/**
 * Given a list of locations and a bounding box, returns the locations that are within the bounding box
 *
 * 1. We create a list of points (using multiPoint) from the locations
 *    - In the properties of each point, we store the location data
 * 2. We create a polygon from the bounding box
 * 3. We check which points are within the polygon
 * 4. We return the location data from the points that are within the polygon
 */
export const getLocationsWithinBBox = (locations: Location[], bbox: BoundingBox) => pointsWithinPolygon(toMultiPoint(locations), toPolygon(bbox)).features.flatMap(f => f.properties)
