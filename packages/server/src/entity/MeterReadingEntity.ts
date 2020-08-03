import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import { MeterEntity } from "./MeterEntity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ID } from "type-graphql";

@Entity({ name: "meter_reading" })
@ObjectType()
export class MeterReadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field({ description: "Watt hour" })
  wh: number;

  @Column()
  @Field({ description: "Voltage Amp Rate per Hour" })
  varh: number;

  @Column()
  @Field()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string;

  @ManyToOne((type) => MeterEntity, (meter) => meter.readings)
  @JoinColumn({
    name: "meter_id",
  })
  meter: MeterEntity;
}
