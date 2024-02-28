export interface MutexHandle<T> {
  get: () => T;
  set: (value: T) => void;
  release: () => void;
}

export class Mutex<T> {
  private promise: Promise<void> | null = null;
  private resolve: (() => void) | null = null;

  constructor(private value: T) {}

  public isLocked(): boolean {
    return Boolean(this.promise);
  }

  public async lock(): Promise<MutexHandle<T>> {
    if (this.promise) {
      await this.promise;
    }

    // We should use `Promise.withResolvers` here, but it's not available yet.
    // https://github.com/microsoft/TypeScript/issues/56483
    this.promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });

    const handle: MutexHandle<T> = {
      get: () => this.value,
      set: (value) => {
        this.value = value;
      },
      release: () => {
        this.resolve?.();
        this.resolve = null;
        this.promise = null;
      }
    };

    return handle;
  }
}
