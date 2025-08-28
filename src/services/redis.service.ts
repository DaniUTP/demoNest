import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB'),
      maxRetriesPerRequest: 3,
      lazyConnect: true, // conecta solo cuando se use
    });

    await this.client.connect();
    this.logger.log('✅ Redis client connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async hMSet(key: string, data: Record<string, string>): Promise<'OK'> {
    return this.client.hmset(key, data);
  }

  async hMGet(key: string, fields: string[]): Promise<Record<string, string>> {
    const values = await this.client.hmget(key, ...fields);
    return fields.reduce((acc, f, i) => {
      acc[f] = values[i] ?? '';
      return acc;
    }, {} as Record<string, string>);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
