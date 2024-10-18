import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'enum', enum: ['M', 'F'] })
  gender: 'M' | 'F';

  @Column('float')
  height: number;

  @Column('float')
  weight: number;

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
}
