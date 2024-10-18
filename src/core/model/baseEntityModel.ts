import { BeforeRecover, BeforeSoftRemove, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm"
import { STATUS } from "../enum/baseEnum"

export default abstract class BaseEntityModel {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id: bigint;

    @CreateDateColumn()
    createDate: Date

    @UpdateDateColumn()
    updateDate?: Date

    @DeleteDateColumn()
    deletedAt?: Date

    @Column({ nullable: true })
    createdBy?: number

    @Column({ nullable: true })
    updatedBy?: number

    @VersionColumn({ default: 1 })
    version: number

    @Column("int", { default: 1 })
    status: STATUS

    @BeforeSoftRemove()
    beforeRemove() {
        this.status = STATUS.DELETED
    }

    @BeforeRecover()
    beforeRecover() {
        this.status = STATUS.ACTIVE
    }
}