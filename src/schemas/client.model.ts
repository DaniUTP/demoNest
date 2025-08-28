
import { Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({
    tableName: 'clients',
    timestamps: false
})
export class Client extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id_client: number;
    @Column({
        type: DataType.INTEGER
    })
    declare level: number;
    @Column({ type: DataType.STRING })
    declare name: string;
    @Column({ type: DataType.STRING })
    declare last_name: string;
    @Column({ type: DataType.STRING })
    declare email: string;
    @Column({ type: DataType.INTEGER })
    declare phone: number;
    @Column({ type: DataType.STRING })
    declare photo: string;
    @Column({ type: DataType.STRING })
    declare password: string;
    @Column({ type: DataType.STRING })
    declare token: string;
    @Column({ type: DataType.STRING })
    declare remember_token: string;
    @Column({ type: DataType.STRING })
    declare code_active: string;
    @Column({ type: DataType.DATE })
    declare last_login: Date;
    @Column({ type: DataType.STRING })
    declare latitud: string;
    @Column({ type: DataType.STRING })
    declare longitud: string;
    @Column({ type: DataType.STRING })
    declare equipment_uuid: string;
    @Column({ type: DataType.STRING })
    declare token_firebase: string;
    @Column({ type: DataType.INTEGER })
    declare notifications: number;
    @Column({ type: DataType.INTEGER })
    declare social_login: number;
    @Column({ type: DataType.STRING })
    declare university: string;
    @Column({ type: DataType.INTEGER })
    declare points: number;
    @Column({ type: DataType.INTEGER })
    declare status: number;
}
