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
  <BluecodeIcon v-if="provider === Provider.Bluecode" />
  <CryptopaymentLinkIcon v-else-if="provider === Provider.CryptopaymentLink" />
  <DefaultAtmIcon v-else-if="provider === Provider.DefaultAtm" />
  <EdeniaIcon v-else-if="provider === Provider.Edenia" />
  <GoCryptoIcon v-else-if="provider === Provider.GoCrypto" />
  <KurantIcon v-else-if="provider === Provider.Kurant" />
</template>
