import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientController } from 'src/controllers/client.controller';
import { ClientListener } from 'src/listeners/ClientListener.listener';
import { Client } from 'src/schemas/client.model';
import { ClientService } from 'src/services/client.service';
import { OpenSearchService } from 'src/services/open-search.service';
import { RedisService } from 'src/services/redis.service';

@Module({
  imports:[SequelizeModule.forFeature([Client])],
  controllers: [ClientController],
  providers: [ClientService,RedisService,OpenSearchService,ClientListener],
})
export class ClientModule {}
