import { BaseEntity, BeforeRecover, BeforeSoftRemove, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm"
import { STATUS } from "../enum/baseEnum"

export default abstract class BaseEntityModel extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id: bigint;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true, type: 'varchar', length: 1000 })
    description: string;

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