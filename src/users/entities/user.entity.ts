import { genSalt, hash } from 'bcrypt';
import { Address } from '../../addresses/entities/address.entity';
import { Document } from './document.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, ManyToOne, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProfessionUser } from '../../professions/entities/profession-user.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'enum', enum: ['M', 'F'] })
  gender: string;

  @Column('float')
  height: number;

  @Column('float')
  weight: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password: string;

  @Column({type: 'bool', name: 'is_admin'})
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'address_id', nullable: true }) // Torna addressId opcional inicialmente
  addressId: string; // ID do endereço associado
 
  @ManyToOne(() => Address, (address) => address.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToOne(() => Document, (document) => document.user)
  document: Promise<Document>;

  @OneToMany(() => ProfessionUser, professionsUsers => professionsUsers.user, { eager: true })
  public professionsUsers: ProfessionUser[];

  // Este campo não uma coluna, apenas para armazenamento de um dado do usuário
  idealWeight: number;

  // Método de instância para calcular o peso ideal.
  calculateIdealWeight(): number {
    if (this.gender === 'M') {
      return (72.7 * this.height) - 58;
    } else {
      return (62.1 * this.height) - 44.7;
    }
  }

  // Assim que uma inst. de User for carregada (@AfterLoad), calcule o peso ideal e armazene.
  @AfterLoad()
  idealWeightStorage(): void {
    this.idealWeight = this.calculateIdealWeight()
  }

  // Hash da senha antes da inserção no DB
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await genSalt(12)
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword
  }
}
