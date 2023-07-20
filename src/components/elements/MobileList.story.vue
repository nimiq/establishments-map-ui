<script setup lang="ts">
import { ProviderName, type NewEstablishment } from "@/database";
import MobileList from "./MobileList.vue";

const establishments: NewEstablishment[] = [{
  uuid: "1",
  name: "Mercedes-Benz Arena",
  category: "entertainment",
  address: "Kreuzbergstrasse 28, 10247, Berlin",
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: "Stadium",
  lat: 1,
  lng: 1,
  rating: 4,
  url: "https://goo.gl/maps/ujJkv9DFuPfkwqat9",
  image: "https://shorturl.at/zOQST",
  provider: ProviderName.Default
}, {
  uuid: "1",
  name: "Mercedes-Benz Arena",
  category: "entertainment",
  address: "Kreuzbergstrasse 28, 10247, Berlin",
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: "Stadium",
  lat: 1,
  lng: 1,
  rating: 4,
  url: "https://goo.gl/maps/ujJkv9DFuPfkwqat9",
  image: "https://shorturl.at/zOQST",
  provider: ProviderName.Default
}, {
  uuid: "1",
  name: "Mercedes-Benz Arena",
  category: "entertainment",
  address: "Kreuzbergstrasse 28, 10247, Berlin",
  buy: ['BTC', 'NIM', 'ETH'],
  sell: [],
  gmapsType: "Stadium",
  lat: 1,
  lng: 1,
  rating: 4,
  url: "https://goo.gl/maps/ujJkv9DFuPfkwqat9",
  image: "https://shorturl.at/zOQST",
  provider: ProviderName.Default
}]
</script>

<template>
  <Story title="Mobile List">
    <Variant title="Default">
      <div class="relative h-screen">
        <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="object-cover h-full">
        <div class="absolute bottom-0 w-full">
          <MobileList :establishments="establishments" class="relative" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
