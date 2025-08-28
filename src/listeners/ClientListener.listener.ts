import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateCache } from 'src/event/UpdateCache.event';
import { OpenSearchService } from 'src/services/open-search.service';
import { RedisService } from 'src/services/redis.service';

@Injectable()
export class ClientListener {
  constructor(private readonly redisService:RedisService,  private readonly openSearch: OpenSearchService){}

  @OnEvent('client.create', { async: true })
  async handlerClientCreate(event: UpdateCache) {
    try {
        await this.redisService.hMSet('clients:' + event.id_client, { name: event.name, last_name: event.last_name, email: event.email,phone:event.phone.toString(),photo:event.photo,password:event.password,code_active:event.code_active,notifications:event.notifications.toString(),social_login:event.social_login.toString(),university:event.university,points:event.points.toString(),status:event.status.toString() });
        await this.openSearch.index('clients', { name: event.name, last_name: event.last_name, email: event.email,phone:event.phone,photo:event.photo,password:event.password,code_active:event.code_active,notifications:event.notifications,social_login:event.social_login,university:event.university,points:event.points,status:event.status }, event.id_client);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }
  }

 @OnEvent('client.update', { async: true })
  async handlerClientUpdate(event: UpdateCache) {
    try {
       await this.redisService.hMSet("clients:" + event.id_client, {
                name: event.name,
                last_name: event.last_name,
                email: event.email
            });
       await this.openSearch.update('clients', event.id_client, { name: event.name, last_name: event.last_name, email: event.email });
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }
  }

   @OnEvent('client.delete', { async: true })
  async handlerClientDelete(event: UpdateCache) {
    try {
        await this.redisService.del('clients:' + event.id_client);
        await this.openSearch.delete('clients', event.id_client);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }
  }
}