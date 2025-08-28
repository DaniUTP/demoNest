import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from '@opensearch-project/opensearch';

@Injectable()
export class OpenSearchService implements OnModuleDestroy {
    private readonly logger = new Logger(OpenSearchService.name);
    private static client: Client | null = null;

    constructor(private readonly configService: ConfigService) { }

    static getClient(configService: ConfigService): Client {
        if (this.client === null) {
            this.createClient(configService);
        }
        return this.client!;
    }

    private static createClient(configService: ConfigService): void {
        try {
            const host = configService.get<string>('OPENSEARCH_HOST');
            const port = configService.get<number>('OPENSEARCH_PORT', 443);
            const user = configService.get<string>('OPENSEARCH_USER');
            const pass = configService.get<string>('OPENSEARCH_PASS');

            if (!host) {
                throw new Error('OpenSearch host is required');
            }

            const clientOptions: ClientOptions = {
                node: `https://${host}:${port}`,
                ssl: {
                    rejectUnauthorized: false,
                },
            };

            // Agregar autenticación solo si se proporciona
            if (user && pass) {
                clientOptions.auth = {
                    username: user,
                    password: pass,
                };
            }

            this.client = new Client(clientOptions);

            // Test connection
            this.testConnection().catch((error) => {
                console.error('❌ OpenSearch connection test failed:', error.message);
            });

        } catch (error) {
            console.error('❌ Failed to create OpenSearch client:', error.message);
            throw error;
        }
    }

    private static async testConnection(): Promise<void> {
        if (!this.client) return;

        try {
            const response = await this.client.info();
            console.log('✅ Connected to OpenSearch Cloud');
            console.log(`📊 Cluster: ${response.body.cluster_name}`);
            console.log(`🔗 Version: ${response.body.version.number}`);
        } catch (error) {
            console.error('❌ OpenSearch connection test failed:', error.message);
            throw error;
        }
    }

    getClient(): Client {
        return OpenSearchService.getClient(this.configService);
    }

    async onModuleDestroy() {
        await this.closeConnection();
    }

    async closeConnection(): Promise<void> {
        // El cliente de OpenSearch no tiene método close() nativo,
        // pero podemos nullificar la instancia
        if (OpenSearchService.client) {
            console.log('🔌 OpenSearch connection closed');
            OpenSearchService.client = null;
        }
    }

    // Método de prueba de conexión
    async testConnection(): Promise<{ success: boolean; message: string; info?: any }> {
        try {
            const client = this.getClient();
            const response = await client.info();

            return {
                success: true,
                message: '✅ Connected to OpenSearch Cloud',
                info: {
                    cluster_name: response.body.cluster_name,
                    version: response.body.version.number,
                    status: 'connected'
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ OpenSearch connection failed: ${error.message}`
            };
        }
    }

    async index(index: string, body: any, id?: string): Promise<any> {
        const client = this.getClient();
        try {
            const params: any = {
                index:index,
                id:id,
                body:body
            };
            const response = await client.index(params);
            return response.body;
        } catch (error) {
            this.logger.error(`Index document error in index ${index}:`, error);
            throw error;
        }
    }

    async update(index: string, id: string, body: any) {
        const client = this.getClient();
        try {
            const param = {
                index: index,
                id: id,
                body: {
                    doc: body
                }
            }
            const response = await client.update(param);
            return response;
        } catch (error) {
            this.logger.error(`Get document error for id ${id} in index ${index}:`, error);
            throw error;
        }
    }

    async searchClientByName(index: string, name: string): Promise<any> {
        console.log("Estoy aqui")
        const client = this.getClient();
        try {
            const response = await client.search({
                index:index,
                body:{
                    query:{
                        wildcard:{
                            name:{
                                value:'*'+name+'*'
                            }
                        }
                    },
                    size:1000
                }
            });
            return response.body.hits.hits;
        } catch (error) {
            this.logger.error('Error: '+ error);
            throw error;
        }
    }
    async delete(index: string, id: string): Promise<any> {
        const client = this.getClient();
        try {
            const response = await client.delete({
                index:index,
                id:id
            });
            return response.body;
        } catch (error) {
            this.logger.error(`Delete document error for id ${id} in index ${index}:`, error);
            throw error;
        }
    }
}