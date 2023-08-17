<script setup lang="ts">
import DesktopList from './DesktopList.vue'
import { type Location, ProviderName } from '@/database'

const locations: Location[] = [{
  uuid: '1',
  name: 'Mercedes-Benz Arena',
  category: 'entertainment',
  address: 'Kreuzbergstrasse 28, 10247, Berlin',
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: 'Stadium',
  lat: 1,
  lng: 1,
  rating: 4,
  url: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
  image: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
  provider: ProviderName.Default,
}, {
  uuid: '2',
  name: 'ATM',
  category: 'cash',
  address: 'Kreuzbergstrasse 28, 10247, Berlin',
  buy: ['BTC', 'NIM', 'ETH', 'Dash', 'XRP'],
  sell: [],
  gmapsType: 'Bank',
  lat: 1,
  lng: 1,
  rating: 4,
  url: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
  provider: ProviderName.DefaultAtm,
}, {
  uuid: '2',
  name: 'ATM (Kurant)',
  category: 'cash',
  address: 'Kreuzbergstrasse 28, 10247, Berlin',
  buy: ['BTC', 'NIM'],
  sell: ['NIM'],
  gmapsType: 'Bank',
  lat: 1,
  lng: 1,
  rating: 4,
  url: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
  provider: ProviderName.Kurant,
}, {
  uuid: '3',
  name: 'Room 88',
  category: 'entertainment',
  address: 'Kreuzbergstrasse 28, 10247, Berlin',
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: 'Stadium',
  lat: 1,
  lng: 1,
  rating: 4,
  url: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
  image: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  provider: ProviderName.Bluecode,
}, {
  uuid: '4',
  name: 'Mercedes-Benz Arena',
  category: 'entertainment',
  address: 'Kreuzbergstrasse 28, 10247, Berlin',
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: 'Stadium',
  lat: 1,
  lng: 1,
  rating: 4,
  url: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
  image: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
  provider: ProviderName.GoCrypto,
}]
</script>

<template>
  <Story title="Desktop List">
    <DesktopList :locations="locations" />
  </Story>
</template>
