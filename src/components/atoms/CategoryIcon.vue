<script setup lang="ts">
import CarsBikesIcon from '@/components/icons/categories/cars_bikes.vue'
import CashIcon from '@/components/icons/categories/cash.vue'
import ComputerElectronicsIcon from '@/components/icons/categories/computer_electronics.vue'
import EntertainmentIcon from '@/components/icons/categories/entertainment.vue'
import FoodDrinksIcon from '@/components/icons/categories/food_drinks.vue'
import HealthBeautyIcon from '@/components/icons/categories/health_beauty.vue'
import HotelLodgingIcon from '@/components/icons/categories/hotel_lodging.vue'
import LeisureActivitiesIcon from '@/components/icons/categories/leisure_activities.vue'
import MiscellaneousIcon from '@/components/icons/categories/miscellaneous.vue'
import RestaurantBarIcon from '@/components/icons/categories/restaurant_bar.vue'
import ShopIcon from '@/components/icons/categories/shop.vue'
import SportsFitnessIcon from '@/components/icons/categories/sports_fitness.vue'
import { Category } from '@/types'

defineProps({
  category: {
    type: String as () => Category,
    required: true,
  },
})
</script>

<template>
  <CarsBikesIcon v-if="category === Category.CarsBikes" />
  <CashIcon v-else-if="category === Category.Cash" />
  <ComputerElectronicsIcon v-else-if="category === Category.ComputerElectronics" />
  <EntertainmentIcon v-else-if="category === Category.Entertainment" />
  <FoodDrinksIcon v-else-if="category === Category.FoodDrinks" />
  <HealthBeautyIcon v-else-if="category === Category.HealthBeauty" />
  <HotelLodgingIcon v-else-if="category === Category.HotelLodging" />
  <LeisureActivitiesIcon v-else-if="category === Category.LeisureActivities" />
  <MiscellaneousIcon v-else-if="category === Category.Miscellaneous" />
  <RestaurantBarIcon v-else-if="category === Category.RestaurantBar" />
  <ShopIcon v-else-if="category === Category.Shop" />
  <SportsFitnessIcon v-else-if="category === Category.SportsFitness" />
</template>
