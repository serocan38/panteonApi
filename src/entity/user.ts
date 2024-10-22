import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Balance } from "./balance";
import { Country } from "./country";
import { Transaction } from "./transaction";
import BaseEntityModel from "../core/model/baseEntity";

@Entity()
export class User extends BaseEntityModel {

    @Column()
    username: string;

    @ManyToOne(() => Country, country => country.id)
    country?: Country;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

    @OneToOne(() => Balance, (balance) => balance.user)
    balance: Balance;
}