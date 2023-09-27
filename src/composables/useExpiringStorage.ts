import type { Serializer } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

export interface ExpiringValue<T> {
  value: T
  expires: string
}

interface UseExpiringStorageBaseOptions<T> {
  /**
   * The amount of time in ms when the storage expires
   */
  expiresIn: number

  /**
   * If true, the storage will be updated when it expires
   * @default true
   */
  autoRefresh?: boolean

  /**
   * The serializer to use
   * @default { read: JSON.parse, write: JSON.stringify }
   */
  serializer?: Serializer<ExpiringValue<T>>
}

interface UseExpiringStorageSyncOptions<T> extends UseExpiringStorageBaseOptions<T> {
  /**
   * If provided, it will be used to get the value when the storage is empty and once the storage expires
   * @default undefined
   */
  getValue?: () => T
}

interface UseExpiringStorageAsyncOptions<T> extends UseExpiringStorageBaseOptions<T> {
  /**
   * If provided, it will be used to get the value when the storage is empty and once the storage expires.
   * If you want to initialize the storage with a value, use init() as follows
   * @example
   *  const { payload, init } = useExpiringStorage('YOUR_KEY', {getAsyncValue: 'your async function'})
   *  await init() // Initialize the storage with the value if it doesn't exist
   *
   * @default undefined
   */
  getAsyncValue?: () => Promise<T>
}

const storage = globalThis.localStorage
const hasExpired = (expiryDate: string) => new Date(expiryDate).getTime() <= Date.now()
const defaultSerializer: Serializer<ExpiringValue<any>> = {
  read: JSON.parse,
  write: JSON.stringify,
}

/**
 * Returns a storage that expires after the given date
 *
 * @param key the key to use
 * @param defaultValue the default value to use
 * @param getValue the function to get the value. It will run when the storage is empty and once the storage expires
 * @returns
 */
export function useExpiringStorage<T>(_key: string, options: UseExpiringStorageSyncOptions<T> | UseExpiringStorageAsyncOptions<T>) {
  const key = `cryptomap__${_key}`
  const { expiresIn, autoRefresh = true, serializer = defaultSerializer as Serializer<ExpiringValue<T>> } = options
  if (!(options as UseExpiringStorageSyncOptions<T>).getValue && !(options as UseExpiringStorageAsyncOptions<T>).getAsyncValue)
    throw new Error('Either getValue or getAsyncValue must be provided')

  const isAsync = 'getAsyncValue' in options
  const getValue = isAsync ? (options as UseExpiringStorageAsyncOptions<T>).getAsyncValue! : (options as UseExpiringStorageSyncOptions<T>).getValue!

  const storedValue = storage.getItem(key) ? serializer.read(storage.getItem(key)!) as ExpiringValue<T> : undefined
  const alreadyExists = !!storedValue && !hasExpired(storedValue.expires)

  // eslint-disable-next-line no-console
  console.log(`useExpiringStorage ${key}: ${alreadyExists ? '♻️ Reusing value' : `🛎️ Needs to create a new one. ${'getAsyncValue' in options ? 'Use `await init()` before reading payload.' : ''}`}`)

  let initialValue: T | undefined
  if (alreadyExists)
    initialValue = storedValue!.value
  else if (!isAsync)
    initialValue = getValue() as T

  const stored = ref(initialValue) as Ref<T>

  watch(stored, () => {
    if (!stored.value)
      return
    const expires = new Date(Date.now() + expiresIn).toISOString()
    storage.setItem(key, serializer.write({ value: stored.value, expires }))
  }, { immediate: true, deep: true })

  async function refreshData(expiresIn: number) {
    if (autoRefresh) {
      setTimeout(async () => {
        // eslint-disable-next-line no-console
        console.log(`LocalStorage ${key}: ♻️ Refreshing value`)
        stored.value = await getValue()
        refreshData(expiresIn)
      }, expiresIn)
    }
  }

  /**
   * If the value in the storage has expired or it does not exists, it will be updated with the new value
   */
  async function init() {
    if (!alreadyExists)
      stored.value = await getValue()
  }

  const remainingTime = (alreadyExists && !!storedValue.value && storedValue.expires) ? new Date(storedValue.expires).getTime() - Date.now() : expiresIn
  refreshData(remainingTime)
  return {
    payload: computed(() => stored.value),
    init,
    alreadyExists,
  }
}
