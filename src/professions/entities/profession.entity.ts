import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProfessionUser } from './profession-user.entity';

@Entity('profession')
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'area_expertise', type: 'varchar', length: 255 })
  areaExpertise: string;

  @Column({ name: 'average_salary', type: 'decimal' })
  averageSalary: number;

  @Column({ name: 'in_person', type: 'boolean', default: true })
  inPerson: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProfessionUser, professionsUsers => professionsUsers.profession, { eager: true })
  public professionsUsers: ProfessionUser[];
}