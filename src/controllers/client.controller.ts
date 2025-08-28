import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClientService } from 'src/services/client.service';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post('bonsai')
    async search(@Body() body, @Res() response: Response) {
        console.log("body:" + body.name)
        const data = await this.clientService.searchClientByName(body.name);
        return response.status(HttpStatus.OK).json(data);
    }
    @Get("query/:id")
    async showQuery(@Param('id') id:number,@Res()response:Response)
    {
        const client= await this.clientService.showQuery(id);
        return response.status(HttpStatus.OK).json(client);
    }
    @Get()
    async index(@Res() response: Response) {
        const clients = await this.clientService.index();
        return response.status(HttpStatus.OK).json(clients);
    }

    @Post()
    async store(@Body() body: Record<string, any>, @Res() response: Response) {
        const client = await this.clientService.store(body);
        return response.status(HttpStatus.CREATED).json(client);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() client, @Res() response: Response) {
        const message = await this.clientService.update(id, client);
        return response.status(HttpStatus.OK).json(message);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() response: Response) {
        const message = await this.clientService.delete(id);
        return response.status(HttpStatus.OK).json(message);
    }

    @Get(':id')
    async show(@Param('id') param: string, @Res() response: Response) {
        const client = await this.clientService.show(param);
        return response.status(HttpStatus.OK).json(client);
    }
    @Post('massive')
    async massiveRegister(@Res() response: Response) {
        const message =await this.clientService.massiveRegister();
        return response.status(HttpStatus.OK).json(message);
    }
    @Post('bonsai-query')
    async searchClientByNameQuery(@Body('name') body,@Res() response:Response)
    {
        const client=await this.clientService.searchClientByNameQuery(body);
        return response.status(HttpStatus.OK).json(client);
    }
}
