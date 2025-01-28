import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Profession } from "./profession.entity"
import { User } from "../../users/entities/user.entity"

@Entity('profession_user')
export class ProfessionUser {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({ name: 'profession_id' })
    public professionId: number

    @Column({ name: 'user_id' })
    public userId: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Profession, (profession) => profession.professionsUsers)
    @JoinColumn({name: 'profession_id'})
    public profession: Profession

    @ManyToOne(() => User, (user) => user.professionsUsers)
    @JoinColumn({name: 'user_id'})
    public user: User
}