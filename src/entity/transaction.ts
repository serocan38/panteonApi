import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import BaseEntityModel from "../core/model/baseEntity";

@Entity()
export class Transaction extends BaseEntityModel {
    @ManyToOne(() => User, user => user.id, )
    user: User;

    @Column()
    value: number;
}