import { Field } from "type-graphql";
import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Generated,
  OneToMany,
} from "typeorm";
import { MeterReadingEntity } from "./MeterReadingEntity";

@Entity({ name: "meter" })
@ObjectType()
export class MeterEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Generated()
  id: number;

  @Column({ nullable: true })
  @Field({ description: "The meter number of the read device" })
  name: string;

  @OneToMany(
    (type) => MeterReadingEntity,
    (readingEntity) => readingEntity.meter,
    {
      cascade: false,
    }
  )
  @Field((type) => [MeterReadingEntity])
  readings: MeterReadingEntity[];
}
