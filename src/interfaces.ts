// TODO Redo this interfaces

/*
  General
*/
export interface HTMLElement {
  requestFullscreen?: () => Promise<void>
  msRequestFullScreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  webkitRequestFullScreen?: () => Promise<void>
}

/*
  Maps related
*/
export interface bounds {
  Ra: {
    hi: number
    lo: number
  }
  ub: {
    hi: number
    lo: number
  }
}

export interface coords {
  lat: number | undefined
  lng: number | undefined
}

export interface boundingBox {
  swLng: number | null
  swLat: number | null
  neLng: number | null
  neLat: number | null
}

/*
  merchant-map-client
*/
export interface pickupData {
  created_at: string
  geo_location: {
    coordinates: number[]
    type: string
  }
  id: number
  label: string | null
  place_id: string | null
  place_information: string
  place_information_parsed: geoInfrmation
}

export interface geoInfrmation {
  address_components: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  adr_address: string // <span class=\"street-address\">Street 1</span>, <span class=\"postal-code\">1234</span> <span class=\"locality\">City</span>, <span class=\"country-name\">Country</span>
  business_status: string // OPERATIONAL
  formatted_address: string // "Street 1, 1234 City, Country"
  formatted_phone_number: string // "12345 1234567"
  geometry: {
    location: coords
    viewport: {
      northeast: coords
      southwest: coords
    }
  }
  icon: string // https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png
  icon_background_color: string // "#FF9E67"
  icon_mask_base_uri: string // "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet"
  international_phone_number: string // "+23 2334 12323"
  name: string // "Super Restaurant X"
  opening_hours: {
    open_now: boolean
    periods: {
      close: {
        day: number
        time: string // 2200
      }
      open: {
        day: number
        time: string // 1800
      }
    }[]
    weekday_text: string[] // Monday: 6:00 – 10:00 PM
  }
  photos?: {
    height: number
    html_attributions: string[] // <a href=\"https://maps.google.com/maps/contrib/113921935049083142308\">STEAK&#39;S BAR Restaurant</a>,
    photo_reference: string // CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU
  }[]
  place_id: string
  plus_code: {
    compound_code: string
    global_code: string
  }
  price_level: number // 2
  rating: number // 4.6
  reference: string // "ChIJzbnO-Zjyc0cRB6fNXpoJH58"
  reviews: Record<string, unknown>[] // todo, not sure how this looks as no entry currently has reviews
  types: string[] // "restaurant", "food", "point_of_interest"
  url: string // "https://maps.google.com/?cid=11465893734928721671"
  user_ratings_total: number // 186
  utc_offset: number // 120
  vicinity: string // Street 1, City
  website: string // URL
}

/*
  made a seperate interface to declare it properly
  on the ListItem component
*/
export interface itemData {
  id: number
  label: string
  description: string
  website: string | null
  email: string | null
  phone: string | null
  zip: string | null
  city: string | null
  country: string | null
  digital_goods: boolean
  created_at: string
  updated_at: string
  address_line_1: string | null
  address_line_2: string | null
  address_line_3: string | null
  pickups: pickupData[]
  shippings: pickupData[] // todo: no data, yet (assuming the same as pickups)
}

export interface merchant_map_result {
  current_page: number
  data: itemData[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links:
  | [
    {
      url: string | null
      label: string
      active: boolean
    },
  ]
  | []
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

/*
  Content Elements
*/
export interface selectEntry {
  id: string
  name: string
}

/*
  Filter
*/
export interface searchFilter {
  bounding_box?: string
  limit?: number
  accepts?: string[] // todo: not filterable, yet (backend-wise)
}
