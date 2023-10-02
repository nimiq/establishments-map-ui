<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  languages: {
    type: Array as () => string[],
    required: true,
    validator: entries =>
      Array.isArray(entries)
      && entries.length > 0
      && !entries.some(entry => typeof entry !== 'string'),
  },
  value: String,
})

const emit = defineEmits(['update:language'])

const selectedLanguage = ref(props.languages[0])
const isListShown = ref(false)
const canListBeShown = ref(false)
let closeTimeout = -1
const listEntries = ref<HTMLDivElement[]>([])

// _onLanguagesChange
watch(
  () => props.languages,
  (languages) => {
    if (languages.includes(selectedLanguage.value))
      return
    selectedLanguage.value = languages[0]
  },
)

// _onExternalValueChange
watch(
  () => props.value,
  (value) => {
    if (!value)
      return
    if (!props.languages.includes(value))
      return
    selectedLanguage.value = value
  },
  { immediate: true },
)

// _onValueChange
watch(
  selectedLanguage,
  (value) => {
    emit('update:language', value)
  },
)

async function _showList() {
  if (!canListBeShown.value)
    return
  clearTimeout(closeTimeout)
  if (isListShown.value)
    return
  isListShown.value = true
  await nextTick()
  _focusListEntry(selectedLanguage.value)
}

function _hideList(delay = 0) {
  clearTimeout(closeTimeout)
  closeTimeout = window.setTimeout(() => {
    isListShown.value = false
  }, delay)
}

function _moveListFocus(offset: number) {
  if (!listEntries.value)
    return
  const currentIndex = listEntries.value.indexOf(document.activeElement as HTMLDivElement)
  if (currentIndex === -1)
    return
  const newIndex = (props.languages.length + currentIndex + offset) % props.languages.length
  _focusListEntry(props.languages[newIndex])
}

function _focusListEntry(language: string) {
  const listEntry = listEntries.value[props.languages.indexOf(language)]
  if (listEntry)
    listEntry.focus()
}

function handleClick() {
  // When the modal opens it triggers the focus event opening the list. We don't want that.
  // So only when the element is clicked we will allow the focus event to open the list.
  canListBeShown.value = true
  _showList()
}
</script>

<template>
  <div
    class="text-base font-semibold tracking-[.125rem] uppercase cursor-pointer relative"
    :tabindex="!isListShown && languages.length > 1 ? 0 : -1" @click.once="handleClick" @focus.capture="_showList" @blur.capture="
      // Do not hide the list immediately to wait whether the next focused element is also a language list entry,
      // because blurs also occur when moving between the list entries.
      _hideList(50)
    "
  >
    <div class="flex text-space group">
      <span>{{ selectedLanguage }}</span>
      <div
        v-if="languages.length > 1"
        class="w-0 h-0 transition-transform duration-200 border-transparent rounded-sm border-xl relative bottom-px border-r-space border-b-space opacity-30 origin-[70%_85%] scale-[.35] group-hover:scale-[.45] rotate-45 group-hover:rotate-[135deg] ml-auto"
      />
    </div>
    <transition name="transition-fade">
      <div
        v-if="isListShown && languages.length > 1"
        class="absolute px-3 py-2 rounded-sm -right-3 -bottom-2 text-white/50 bg-space drop-shadow"
      >
        <div
          v-for="language of languages" ref="listEntries" :key="language" tabindex="0" class="flex group"
          @mouseenter="($event.target as HTMLElement)?.focus()" @click="selectedLanguage = language; _hideList()"
          @keydown.space.enter.prevent="selectedLanguage = language; _hideList()"
          @keydown.down.prevent="_moveListFocus(+1)" @keydown.up.prevent="_moveListFocus(-1)"
          @keydown.left.esc.prevent="() => _hideList()"
        >
          <span class="transition-colors group-hover:text-white">{{ language }}</span>
          <div
            class="w-0 h-0 transition-opacity duration-200 border-transparent rounded-sm opacity-0 border-xl border-r-white border-b-white group-hover:opacity-100 origin-[70%_85%] scale-[.45] rotate-[135deg] ml-auto"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.transition-fade-enter-active,
.transition-fade-leave-active {
  transition: opacity .3s ease-in-out;
}

.transition-fade-enter,
.transition-fade-leave-to {
  opacity: 0 !important;
}
</style>
