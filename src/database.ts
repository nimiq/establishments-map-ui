import type { Suggestion } from "./stores/autocomplete";
import type { BoundingBox } from "./stores/map";

export type Provider = {
  id: number;
  name: string;
};

export type ProviderWithCurrencies = Provider & {
  buy: string[];
  sell: string[];
};

export type Currency = {
  name: string;
  symbol: string;
}

export type Category = {
  id: number;
  label: string;
}

export type BaseEstablishment = {
  uuid: string;
  name: string;
  lat: number;
  lng: number;
  providers: ProviderWithCurrencies[];
  category: string;
  gmapsTypes: Array<string>;
  hasAllInfo: boolean;
}

export type Establishment = Omit<BaseEstablishment, "hasAllInfo"> & {
  photo?: string;
  url?: string;
  gmapsPlaceId: string;
  category: string;
  address: string;
  rating: number;
  instagram: string;
  facebook: string;
  hasAllInfo: true;
}

export type NewEstablishment = {
  name: string,
  address: string,
  category: string,
  gmapsType: string,
  lat: number,
  lng: number,
  provider: string,
  buy: string[],
  sell: string[],
  rating?: number,
  url?: string,
  image?: string
}

const databaseUrl = import.meta.env.VITE_DATABASE_URL
const databaseToken = import.meta.env.VITE_DATABASE_KEY

const providers: Provider[] = [];
const currencies: Currency[] = [];
const categories: Category[] = [];

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

export async function getProviders() {
  if (providers.length === 0) {
    providers.push(...await fetchDb<Provider[]>("providers?select=id,name") ?? []);
  }
  return providers;
}

export async function getCurrencies() {
  if (currencies.length === 0) {
    currencies.push(...await fetchDb<Currency[]>("currencies?select=name,symbol") ?? []);
  }
  return currencies;
}

export async function getCategories() {
  if (categories.length === 0) {
    categories.push(...await fetchDb<Category[]>("establishment_categories?select=id,label") ?? []);
  }
  return categories;
}

export async function getEstablishments({ northEast, southWest }: BoundingBox): Promise<BaseEstablishment[]> {
  const query = `rpc/get_establishments?swlng=${southWest.lng}&nelng=${northEast.lng}&swlat=${southWest.lat}&nelat=${northEast.lat}`;
  type EstablishmentDb = Omit<BaseEstablishment, "providers" | "category"> & { providers: ProviderWithCurrencies[], categoryId: number };
  const data = await fetchDb<EstablishmentDb[]>(query) ?? [];

  const providers = await getProviders();
  const categories = await getCategories();

  // Mapping the data to the desired structure
  const establishments = data.map(establishment => {
    const mappedProviders = establishment.providers?.map(providerInfo => {
      const provider = providers.find(p => p.id === providerInfo.id);
      return { ...providerInfo, ...provider };
    });

    const category = categories.find(c => c.id === establishment.categoryId)?.label || 'miscellaneous';

    return {
      uuid: establishment.uuid,
      name: establishment.name,
      lat: establishment.lat,
      lng: establishment.lng,
      providers: mappedProviders,
      category,
      hasAllInfo: false
    };
  });

  return establishments;
}


export async function fetchEstablishment(uuid: string): Promise<Establishment | undefined> {
  const query = `rpc/get_establishment_by_uuid?establishment_uuid=${uuid}`;
  const establishment = await fetchDb<Establishment>(query);
  return establishment;
}

export async function queryResults(userQuery: string) {
  const query = `rpc/query_search?query=${userQuery}`;
  const suggestions = await fetchDb<Suggestion[]>(query);
  return suggestions || [];
}




