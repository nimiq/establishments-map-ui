export type SyncResult<T> =
  | { data: T, error: undefined }
  | { data: undefined, error: string }

export type Result<T> = Promise<SyncResult<T>>
