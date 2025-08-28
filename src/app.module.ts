import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './module/client.module';
import { Client } from './schemas/client.model';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisService } from './services/redis.service';
import { OpenSearchService } from './services/open-search.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Client],
      autoLoadModels: true,
      synchronize: true,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
        evict: 100,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // necesario con NeonDB
        },
      }
    }),
    ClientModule,
  ],
  providers: [RedisService, OpenSearchService],
})
export class AppModule { }
