import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Device } from './device.entity';

@Entity('enterprises')
export class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(
    () => Employee,
    (employee) => employee.enterprise,
  )
  employees: Employee[];

  @OneToMany(
    () => Device,
    (device) => device.enterprise,
  )
  devices: Device[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
