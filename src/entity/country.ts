import { Column, Entity } from "typeorm";
import BaseEntityModel from "../core/model/baseEntity";


@Entity()
export class Country extends BaseEntityModel {
    @Column()
    alpha2Code?: string;

    @Column()
    alpha3Code?: string;

    @Column()
    phoneCode?: string;
}