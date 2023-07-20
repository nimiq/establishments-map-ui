<script setup lang="ts">
import CarsBikesIcon from '@/components/icons/categories/cars_bikes.vue'
import CashIcon from "@/components/icons/categories/cash.vue"
import ComputerElectronicsIcon from "@/components/icons/categories/computer_electronics.vue"
import EntertainmentIcon from "@/components/icons/categories/entertainment.vue"
import FoodDrinksIcon from "@/components/icons/categories/food_drinks.vue"
import HealthBeautyIcon from "@/components/icons/categories/health_beauty.vue"
import HotelLodgingIcon from "@/components/icons/categories/hotel_lodging.vue"
import LeisureActivitiesIcon from "@/components/icons/categories/leisure_activities.vue"
import MiscellaneousIcon from "@/components/icons/categories/miscellaneous.vue"
import RestaurantBarIcon from "@/components/icons/categories/restaurant_bar.vue"
import ShopIcon from "@/components/icons/categories/shop.vue"
import SportsFitnessIcon from "@/components/icons/categories/sports_fitness.vue"


const props = defineProps({
	category: {
		type: String,
		required: true,
	},
})

const icon = {
	cars_bikes: CarsBikesIcon,
	cash: CashIcon,
	computer_electronics: ComputerElectronicsIcon,
	entertainment: EntertainmentIcon,
	food_drinks: FoodDrinksIcon,
	health_beauty: HealthBeautyIcon,
	hotel_lodging: HotelLodgingIcon,
	leisure_activities: LeisureActivitiesIcon,
	miscellaneous: MiscellaneousIcon,
	restaurant_bar: RestaurantBarIcon,
	shop: ShopIcon,
	sports_fitness: SportsFitnessIcon,
}[props.category]
</script>

<template>
	<component :is="icon" />
</template>
