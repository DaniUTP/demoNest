import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from 'src/schemas/client.model';
import * as bcrypt from 'bcrypt';
import { RedisService } from './redis.service';
import { OpenSearchService } from './open-search.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateCache } from 'src/event/UpdateCache.event';
import { Op } from 'sequelize';

@Injectable()
export class ClientService {
    constructor(@InjectModel(Client) private readonly userModel: typeof Client,
        private readonly redisService: RedisService,
        private readonly openSearch: OpenSearchService,
        private readonly eventEmitter: EventEmitter2) { }

    async index() {
        try {
            const clients = await this.userModel.findAll({
                attributes: ['id_client', 'name', 'last_name']
            });
            return clients;
        } catch (error) {
            return error;
        }
    }
    async store(request) {
        try {
            const client = await this.userModel.create({
                level: 1,
                name: request.name,
                last_name: request.last_name,
                email: request.email,
                phone: request.phone,
                photo: request.photo,
                password: await bcrypt.hash(request.password, 12),
                token: '',
                remember_token: '',
                code_active: "efwfwef",
                latitud: '',
                longitud: '',
                equipment_uuid: '',
                token_firebase: '',
                notifications: 0,
                social_login: 0,
                university: request.university,
                points: 0
            });
            const updateCache = new UpdateCache();
            updateCache.id_client = client.id_client.toString();
            updateCache.name = client.name;
            updateCache.last_name = client.last_name;
            updateCache.email = client.email;
            updateCache.phone= client.phone;
            updateCache.photo=client.photo;
            updateCache.password=client.password;
            updateCache.code_active=client.code_active;
            updateCache.notifications=client.notifications;
            updateCache.social_login=client.social_login;
            updateCache.university=client.university;
            updateCache.points=client.points;
            updateCache.status=client.status;

            this.eventEmitter.emit(
                'client.create',
                updateCache
            );
            return { message: "Usuario registrado" };
        } catch (error) {
            return error;
        }
    }
    async update(id: string, client) {
        try {
            await this.userModel.update({
                name: client.name,
                last_name: client.last_name,
                email: client.email
            }, {
                where: { id_client: id }
            });
            const updateCache = new UpdateCache();
            updateCache.id_client = id;
            updateCache.name = client.name;
            updateCache.last_name = client.last_name;
            updateCache.email = client.email;
            this.eventEmitter.emit(
                'client.update',
                updateCache
            );
            return { message: "Usuario actualizado" };
        } catch (error) {
            return error;
        }
    }
    async delete(id: string) {
        try {
            await this.userModel.destroy(
                { where: { id_client: id } }
            );
            const updateCache = new UpdateCache();
            updateCache.id_client = id;
            updateCache.name = "";
            updateCache.last_name = "";
            updateCache.email = "";
            this.eventEmitter.emit(
                'client.delete',
                updateCache
            );
            return { message: "Usuario eliminado" };
        } catch (error) {
            return error;
        }
    }
    async show(idClient: string) {
        try {
            const client = await this.redisService.hMGet('clients:' + idClient, [
                'name',
                'last_name',
                'email'
            ]);
            return client;
        } catch (error) {
            console.error("Error in show method:", error);
            throw error;
        }
    }
    async searchClientByName(name: string) {
        try {
            const data = await this.openSearch.searchClientByName('clients', name);
            return data;
        } catch (error) {
            console.error("Error in search by name method:", error);
            throw error;
        }
    }
    async massiveRegister()
    {
      try {
        const firstNames = ['Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Elena', 'Diego', 'Carmen', 'Javier', 'Isabel', 'Ricardo', 'Patricia', 'Fernando', 'Rosa', 'Daniel', 'Andrea'];
        const lastNames = ['Garcia', 'Rodriguez', 'Gonzalez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Gomez', 'Martin', 'Jimenez', 'Ruiz', 'Hernandez', 'Diaz', 'Moreno', 'Muñoz', 'Alvarez', 'Romero', 'Alonso', 'Navarro'];
        const universities = [
            'UNMSM', 'ULIMA', 'PUCP', 'USMP', 'UPCH', 
            'UP', 'UTEC', 'UPC', 'UNI', 'UNFV'
        ];
        
        for (let i = 0; i < 300; i++) {
            try {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
                const phone = `9${Math.floor(1000000 + Math.random() * 9000000)}`;
                const university = universities[Math.floor(Math.random() * universities.length)];

                const userData = {
                    level: 1,
                    name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    photo: `https://avatars.githubusercontent.com/u/${Math.floor(10000 + Math.random() * 90000)}`,
                    password: await bcrypt.hash('Password123', 12),
                    token: '',
                    remember_token: '',
                    code_active: Math.random().toString(36).substring(2, 12),
                    latitud: (Math.random() * 180 - 90).toFixed(6),
                    longitud: (Math.random() * 360 - 180).toFixed(6),
                    equipment_uuid: Math.random().toString(36).substring(2, 15),
                    token_firebase: Math.random().toString(36).substring(2, 50),
                    notifications: Math.floor(Math.random() * 2),
                    social_login: Math.floor(Math.random() * 2),
                    university: university,
                    points: Math.floor(Math.random() * 1001),
                    status: Math.floor(Math.random() * 2)
                };

                const client = await this.userModel.create(userData);

                const updateCache = new UpdateCache();
                updateCache.id_client = client.id_client.toString();
                updateCache.name = client.name;
                updateCache.last_name = client.last_name;
                updateCache.email = client.email;
                updateCache.phone = client.phone;
                updateCache.photo = client.photo;
                updateCache.password = client.password;
                updateCache.code_active = client.code_active;
                updateCache.notifications = client.notifications;
                updateCache.social_login = client.social_login;
                updateCache.university = client.university;
                updateCache.points = client.points;
                updateCache.status = client.status;

                this.eventEmitter.emit(
                    'client.create',
                    updateCache
                );

                console.log(`✅ Usuario ${i + 1}/300 creado: ${client.email}`);

                // Pequeña pausa cada 50 registros
                if (i % 50 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (error) {
                console.error(`❌ Error creando usuario ${i + 1}:`, error);
            }
        }

        return {
            message: "Registro masivo completado",
            total: 300
        };

    } catch (error) {
        console.error('❌ Error en registro masivo:', error);
        return {
            message: "Error en registro masivo",
            error: error.message
        };
    }
}
    async searchClientByNameQuery(name:string)
    {
        try {
            const client= await this.userModel.findAll(
                {
                    where:{
                        name:{
                            [Op.like]:"%"+name+"%"
                        }
                    }
                }
            );
            return client;
        } catch (error) {
             console.error('❌ Error en registro masivo:', error);
        }
    }
    async showQuery(id:number)
    {
        try {
            const client=await this.userModel.findOne({
                attributes:['name','last_name','email'],
                where:{
                    id_client:id
                }
            });
            return client;
        } catch (error) {
            console.error('❌ Error en registro masivo:', error);
        }
    }
}
