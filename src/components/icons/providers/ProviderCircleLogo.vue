<script setup lang="ts">
import { Provider } from 'types'
import BluecodeIcon from './bluecode.vue'
import CryptopaymentLinkIcon from './cryptopayment-link.vue'
import DefaultAtmIcon from './default-atm.vue'
import EdeniaIcon from './edenia.vue'
import GoCryptoIcon from './gocrypto.vue'
import KurantIcon from './kurant.vue'

defineProps({
  provider: {
    type: String as () => Provider,
    required: true,
  },
})
</script>

<template>
  <div class="grid w-8 h-8 bg-white rounded-full children:w-5 children:h-5 place-content-center">
    <BluecodeIcon v-if="provider === Provider.Bluecode" />
    <CryptopaymentLinkIcon v-else-if="provider === Provider.CryptopaymentLink" />
    <DefaultAtmIcon v-else-if="provider === Provider.DefaultAtm" />
    <EdeniaIcon v-else-if="provider === Provider.Edenia" class="[&_path]:!fill-[#22afad] [&_path]:!opacity-100" />
    <GoCryptoIcon v-else-if="provider === Provider.GoCrypto" class="[&_path]:!fill-space" />
    <KurantIcon v-else-if="provider === Provider.Kurant" class="[&_path]:!fill-[#b22516] [&_path]:!opacity-100" />
  </div>
</template>
