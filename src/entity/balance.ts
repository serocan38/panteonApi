import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import BaseEntityModel from "../core/model/baseEntity";

@Entity()
export class Balance extends BaseEntityModel {
    @OneToOne(() => User, (user) => user.balance)
    @JoinColumn()
    user: User;

    @Column({ default: 0 })
    weeklyBalance: number;

    @Column({ default: 0 })
    totalBalance: number;
}