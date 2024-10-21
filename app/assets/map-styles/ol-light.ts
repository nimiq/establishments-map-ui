import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'
import Text from 'ol/style/Text'

// Style for map features like roads
export const mapStyle = new Style({
  stroke: new Stroke({
    color: '#888', // Gray for roads
    width: 2,
  }),
  text: new Text({
    font: '12px sans-serif',
    fill: new Fill({
      color: '#333', // Label text color
    }),
    textBaseline: 'middle',
    placement: 'line',
  }),
})

const image = new CircleStyle({
  radius: 5,
  fill: new Fill({ color: 'blue' }),
  stroke: new Stroke({ color: 'red', width: 1 }),
})

export const layerStyle = {
  Point: new Style({
    image,
  }),
}
