import { describe, expect, it } from 'vitest';
import { Mutex } from './index';

describe('mutex', () => {
  it('should lock and release', async () => {
    const mutex = new Mutex(0);

    expect(mutex.isLocked()).toBe(false);

    const handle = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);

    expect(handle.get()).toBe(0);
    handle.set(1);
    expect(handle.get()).toBe(1);

    handle.release();
    expect(mutex.isLocked()).toBe(false);
  });

  it('should not lock when already locked', async () => {
    const mutex = new Mutex(0);

    await mutex.lock();
    expect(mutex.isLocked()).toBe(true);

    const fn = () => {
      return new Promise((resolve, reject) => {
        void mutex.lock().then(resolve);
        setTimeout(() => reject(new Error('lock should not resolve')), 10);
      });
    };

    await expect(async () => await fn()).rejects.toThrow();
  });

  it('should lock and release multiple times', async () => {
    const mutex = new Mutex(0);

    const handle1 = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);

    handle1.release();
    expect(mutex.isLocked()).toBe(false);

    const handle2 = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);

    handle2.release();
    expect(mutex.isLocked()).toBe(false);
  });
});
