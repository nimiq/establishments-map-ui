import type { CurrencyInner as Currency, CryptoEstablishment, CryptoEstablishmentBaseInner as CryptoEstablishmentBaseApi, GetProviders200Response as Provider, GetProviders200Response } from "@/api";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useApi } from "./api";
import { useMap, type BoundingBox } from "./map";


export type ProviderEstablishment = Provider & {
  buy: Map<string, Currency>;
  sell: Map<string, Currency>;
  both: Map<string, Currency>;
};

export type BaseEstablishment = Omit<CryptoEstablishmentBaseApi, "providersId"> & {
  hasAllInfo: false;
  providers: GetProviders200Response[]; // TODO check whether is necessary or it belongs to type Establishment
}

export type Establishment = Omit<BaseEstablishment, "hasAllInfo" | "providers"> & Omit<CryptoEstablishment, "photoReference" | "enabled" | "providers"> & {
  hasAllInfo: true;
  photoUrl?: string;
  gmapsUrl: string;
  providers: ProviderEstablishment[];
}

export const useEstablishments = defineStore("establishments", () => {
  /**
  * Establishments holds the list of establishments
  * To save memory, we use a Map to store the establishments and at the beginning is an empty Map
  * Once the user starts to navigate the map (moving and dragin the map), we start to fetch the establishments
  * but only "basic" info we need to display in the map: name, category(for the icon), id(for the URL if user clicks) and geoLocation(for the marker)
  * Lets recreate the process:
  * 1, User opens the map. The establishments is empty like { }
  * 2. Once map is loaded, we fetch the establishments in the current viewport (given the bounding box).
  * 3. We store the establishments in the map, but only the basic info. In this case, we store 2 establishments like this:
  *      Map<uuid, { name, category, id, geoLocation }> => 
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 4. User moves the map. We fetch the establishments in the new viewport (given the bounding box). A new establishments is fetched.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 5. User opens the list of establishments. And in the viewport in the list only 2 items fits the list, so we need to fetch the rest of info
  *    given the id. Once the info is loaded, we update the establishments map with the new info.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, providers, rating...} },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, providers, rating... } },
  *         }
  * 6. Once the info is loaded, we no longer will fetch the info for the establishment, because we already have it.
  * 
  * Then we computed the establishments that are currently in the viewport (given the bounding box) and we display them 
  * in the map.
  */
  const establishments = ref(new Map<string, BaseEstablishment | Establishment>([]))

  const apiStore = useApi()

  const mapStore = useMap()
  const { boundingBox, surroundingBoundingBox } = storeToRefs(mapStore)

  function includeEstablishment(establishment: BaseEstablishment | Establishment, { northEast, southWest }: BoundingBox) {
    const { lat, lng } = establishment.geoLocation
    const insideBoundingBox = lat <= northEast.lat && lat >= southWest.lat && lng <= northEast.lng && lng >= southWest.lng
    const ignoreCurrencies = apiStore.selectedCurrencies.length === 0
    const ignoreCategores = apiStore.selectedCategories.length === 0
    const filteredByCurrencies = ignoreCurrencies || establishment.providers.some(p => apiStore.selectedCurrencies.some(c => p.buy.has(c) || p.sell.has(c) || p.both.has(c)))
    const filteredByCategories = ignoreCategores || apiStore.selectedCategories.includes(establishment.category)
    return insideBoundingBox && filteredByCurrencies && filteredByCategories
  }

  // ┌───────────────────────────────┐
  // │                               │
  // │   ┌───────────────────────┐   │
  // │   │                       │◄──┼────── bounding box / user screen
  // │   │  establishmentInView  │   │
  // │   │                       ├───┼─────► same distance as viewport width
  // │   └───────────────────────┘   │
  // │  nearEstablishmentsNotInView  │─────► surroundingBoundingBox is `scaleFactor` times bigger than boundingBox
  // └─────────────────────────────-─┘
  const establishmentsInView = computed(
    () => Array.from(establishments.value.values()).filter(e => includeEstablishment(e, boundingBox.value)))
  // this will be used to show items in the list that are not in the viewport, but user requested to see
  const nearEstablishmentsNotInView = computed(
    () => Array.from(establishments.value.values())
      .filter(e => !establishmentsInView.value.some(eInView => eInView.uuid === e.uuid))
      .filter(e => includeEstablishment(e, surroundingBoundingBox.value)))

  const shouldShowNearby = ref(false)

  function showNearby() {
    shouldShowNearby.value = true
  }

  function hideNearby() {
    shouldShowNearby.value = false
  }

  return {
    surroundingBoundingBox,
    establishments,
    establishmentsInView,
    nearEstablishmentsNotInView,
    shouldShowNearby,
    showNearby,
    hideNearby,
  }
})
