import type { Suggestion } from "./stores/autocomplete";
import type { BoundingBox } from "./stores/map";

export enum Currency {
  NIM = 'NIM',
  BTC = 'BTC',
  USDC_POLYGON = 'USDC_POLYGON',
  ETH = 'ETH',
  LTC = 'LTC',
  LBTC = 'LBTC',
  XLM = 'XLM',
  XRP = 'XRP',
  DASH = 'DASH',
}
export const currencies = Object.values(Currency);

export enum Category {
  CarsBikes = 'cars_bikes',
  Cash = 'cash',
  ComputerElectronics = 'computer_electronics',
  Entertainment = 'entertainment',
  FoodDrinks = 'food_drinks',
  HealthBeauty = 'health_beauty',
  HotelLodging = 'hotel_lodging',
  LeisureActivities = 'leisure_activities',
  Miscellaneous = 'miscellaneous',
  RestaurantBar = 'restaurant_bar',
  Shop = 'shop',
  SportsFitness = 'sports_fitness',
}
export const categories = Object.values(Category);

export enum ProviderName {
  Default = 'Default',
  DefaultAtm = 'DefaultAtm',
  GoCrypto = "GoCrypto",
  Kurant = "Kurant",
  Bluecode = "Bluecode",
  CryptopaymentLink = "CryptopaymentLink",
  Edenia = "Edenia",
}

export enum LocationType {
  Atm = 'atm',
  Shop = 'shop',
}

export type Location = {
  uuid: string,
  name: string,
  address: string,
  category: Category,
  gmaps_type: string,
  lat: number,
  lng: number,
  provider: ProviderName,
  cryptos_accepted: Currency[],
  cryptos_available: Currency[],
  type: LocationType,
  rating?: number,
  photo?: string,
  instagram?: string,
  gmaps?: string,
  facebook?: string,
}

const databaseUrl = import.meta.env.VITE_DATABASE_URL
const databaseToken = import.meta.env.VITE_DATABASE_KEY

async function fetchDb<T>(query: string): Promise<T | undefined> {
  const url = `${databaseUrl}/${query}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': databaseToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).catch(error => {
    return `Error fetching database: ${error}`
  });

  if (typeof response === 'string') {
    console.error(response)
    return undefined
  }

  if (!response.ok) {
    console.error(`Error fetching database: ${response.status} ${response.statusText}`)
    return undefined
  }

  const data: T = await response.json();
  return data;
}

export async function getLocations({ northEast, southWest }: BoundingBox): Promise<Location[]> {
  const query = `rpc/get_Locations?swlng=${southWest.lng}&nelng=${northEast.lng}&swlat=${southWest.lat}&nelat=${northEast.lat}`;
  const data = await fetchDb<Location[]>(query) ?? [];

  const providerNames = Object.values(ProviderName);
  data.forEach(location => {
    if (!providerNames.includes(location.provider)) {
      console.warn(`Unknown provider: ${location.provider}`);
      location.provider = ProviderName.Default;
    }
  });

  data.forEach(location => {
    const type = location.cryptos_available.length > 0 || location.category === Category.Cash
    location.type = type ? LocationType.Atm : LocationType.Shop
  });

  return data;
}
export async function queryResults(userQuery: string) {
  const query = `rpc/query_search?query=${userQuery}`;
  const suggestions = await fetchDb<Suggestion[]>(query);
  return suggestions || [];
}




