import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getString(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.getString(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async getSetMembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  async getTtl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async setString(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (value === undefined) {
      throw new Error(`Cannot save 'undefined' under the key: ${key}`);
    }

    const serialized = JSON.stringify(value);
    await this.setString(key, serialized, ttl);
  }

  async addToSet(key: string, value: string, ttl?: number): Promise<void> {
    const pipeline = this.redis.pipeline();
    pipeline.sadd(key, value);
    if (ttl) {
      pipeline.expire(key, ttl);
    }
    await pipeline.exec();
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async removeFromSet(key: string, value: string): Promise<number> {
    return this.redis.srem(key, value);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }
}
