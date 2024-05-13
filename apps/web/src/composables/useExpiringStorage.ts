import type { Serializer } from '@vueuse/core'
import type { Ref } from 'vue'

export interface ExpiringValue<T> {
  value: T
  expires: string
  timestamp?: string
}

interface UseExpiringStorageBaseOptions {
  /**
   * The amount of time in ms when the storage expires
   */
  expiresIn: number

  /**
   * Timestamp indicating when the storage was last updated.
   * If provided and is newer than the storage's current timestamp, the storage will refresh.
   */
  timestamp?: string

  /**
   * If true, the storage will be updated when it expires
   * @default true
   */
  autoRefresh?: boolean
}

interface UseExpiringStorageSyncOptions<T> extends UseExpiringStorageBaseOptions {
  /**
   * If provided, it will be used to get the value when the storage is empty and once the storage expires
   * @default undefined
   */
  defaultValue?: T
}

interface UseExpiringStorageAsyncOptions<T> extends UseExpiringStorageBaseOptions {
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

// const storage = globalThis.localStorage
const halfDay = 12 * 60 * 60 * 1000

const hasExpired = (expiryDate: string) => new Date(expiryDate).getTime() <= Date.now()

// Use it for localStorage
// function getStoredValue<T>(key: string, serializer: Serializer<ExpiringValue<T>>): ExpiringValue<T> | undefined {
//   const stored = storage.getItem(key)
//   return stored ? serializer.read(stored) as ExpiringValue<T> : undefined
// }

function getStoredValue<T>(key: string, serializer: Serializer<ExpiringValue<T>>): ExpiringValue<T> | undefined {
  const cookie = getCookieValue(key)
  return cookie ? serializer.read(cookie) as ExpiringValue<T> : undefined
}

function getCookieValue(key: string): string | null {
  const b = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)
  return b?.pop() ?? null
}

function setCookie(key: string, value: string, expiresIn: number) {
  const expires = new Date(Date.now() + expiresIn).toUTCString()
  document.cookie = `${key}=${value}; expires=${expires}; path=/`
}

function deleteCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

/**
 *  Determines if the storage should be updated based on its current value and timestamp.
 *
 * @param storedValue - The current value stored with its expiry and timestamp details.
 * @param timestamp - An optional timestamp to compare with the stored value's timestamp.
 * @returns True if storage is either not present, has expired, or if the provided timestamp is newer than the stored timestamp.
 */
function shouldUpdateStorage(storedValue: ExpiringValue<any> | undefined, timestamp?: string): boolean {
  if (!storedValue || hasExpired(storedValue.expires) || !storedValue.value)
    return true
  if (timestamp && storedValue.timestamp && new Date(storedValue.timestamp).getTime() < new Date(timestamp).getTime())
    return true
  return false
}

export function useExpiringStorage<T>(_key: string, options: UseExpiringStorageSyncOptions<T> | UseExpiringStorageAsyncOptions<T>) {
  const key = `cryptomap__${_key}`
  localStorage.removeItem(key) // Delete old localStorage key

  const { expiresIn, autoRefresh = true, timestamp: timestampOption } = options
  const timestamp = timestampOption ? new Date(timestampOption).toISOString() : undefined

  const isAsync = 'getAsyncValue' in options
  const getValue = isAsync
    ? (options as UseExpiringStorageAsyncOptions<T>).getAsyncValue!
    : () => (options as UseExpiringStorageSyncOptions<T>).defaultValue as T

  if (!getValue)
    throw new Error('Either getValue or getAsyncValue must be provided')

  const serializer: Serializer<ExpiringValue<T>> = {
    read: JSON.parse,
    write: JSON.stringify,
  }

  const storedValue = getStoredValue(key, serializer)
  const shouldUpdate = shouldUpdateStorage(storedValue, timestamp)

  const initialValue = shouldUpdate && !isAsync ? getValue() : storedValue?.value
  const stored = ref(initialValue) as Ref<T>

  // Write the value to the storage
  watch(stored, (newValue) => {
    // storage.setItem(key, serializer.write({ value: newValue, expires: new Date(Date.now() + expiresIn).toISOString(), timestamp }))
    setCookie(key, serializer.write({ value: newValue, expires: new Date(Date.now() + expiresIn).toISOString(), timestamp }), expiresIn)
  }, { immediate: true, deep: true })

  const refreshData = async (remainingTime: number) => {
    if (autoRefresh && remainingTime < halfDay) {
      setTimeout(async () => {
        stored.value = await getValue()
        refreshData(expiresIn)
      }, remainingTime)
    }
  }

  const init = async () => {
    if (shouldUpdate)
      stored.value = await getValue()
  }

  const remainingTime = storedValue?.expires
    ? new Date(storedValue.expires).getTime() - Date.now()
    : expiresIn

  refreshData(remainingTime)

  return {
    payload: computed(() => stored.value),
    init,
    // clean: () => storage.removeItem(key),
    clean: () => deleteCookie(key),
  }
}
