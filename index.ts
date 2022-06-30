"use strict";
interface Item {
  key: string;
  TTL?: number;
}

interface CacheIndex {
  [key: string]: number
}

interface CacheItem<T> {
  key: string;
  data: T;
  TTL?: number;
}

interface Options {
  defaultTTL?: number;
  cacheName?: string
}

const DEFAULT_TTL = 60;
const CACHE_TAG = "SLSCache";

export default new class SLSCache {
  private TTL: number = DEFAULT_TTL;
  private cacheTag: string = CACHE_TAG;

  public config(options: Options) {
    const { defaultTTL, cacheName } = options;
    this.TTL = defaultTTL || DEFAULT_TTL;
    this.cacheTag = cacheName || CACHE_TAG;
    this.getIndex();
  }

  private mToMs = (minutes: number) => minutes * 60000;
  private getTTL = (ttl?: number) => Date.now() + this.mToMs(ttl || this.TTL);

  private getIndex(): CacheIndex {
    const index = localStorage.getItem(this.cacheTag);
    if (index) {
      try {
        return JSON.parse(index);
      } catch {
        this.clearCache();
      }
    } else {
      localStorage.setItem(this.cacheTag, "{}");
    }
    return this.getIndex();
  }

  private clearCache() {
    localStorage.removeItem(this.cacheTag);
    const { length } = localStorage;
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.cacheTag + "::")) {
        localStorage.removeItem(key);
      }
    }
  }

  private addToIndex(item: Item) {
    const index = this.getIndex();
    index[item.key] = this.getTTL(item.TTL);
    localStorage.setItem(this.cacheTag, JSON.stringify(index));
  }

  private removeFromIndex(key: string) {
    const index = this.getIndex();
    delete index[key];
    localStorage.setItem(this.cacheTag, JSON.stringify(index));
  }

  private garbageCollector() {
    const index = this.getIndex();
    for (const item in index) {
      if (Object.prototype.hasOwnProperty.call(index, item)) {
        const ttl = index[item];
        if (ttl < Date.now()) {
          localStorage.removeItem(`${this.cacheTag}::${item}`);
          this.removeFromIndex(item);
        }
      }
    }
  }

  public set<T>(key: string, data: T, TTL?: number): void {
    this.garbageCollector();
    this.removeFromIndex(key);
    localStorage.removeItem(key);
    this.addToIndex({ key, TTL });
    localStorage.setItem(`${this.cacheTag}::${key}`, JSON.stringify(data));
  }

  public get<T>(key: string): T | undefined {
    this.garbageCollector();
    const item = localStorage.getItem(`${this.cacheTag}::${key}`);
    return !!item ? JSON.parse(item) as T : undefined;
  }
}