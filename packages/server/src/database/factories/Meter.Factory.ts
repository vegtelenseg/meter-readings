import { define, factory } from "typeorm-seeding";
import { MeterEntity } from "../../entity/MeterEntity";

define(MeterEntity, (_, row) => {
  const meterEntity = new MeterEntity();
  if (row) {
    meterEntity.name = row["serial"];
  }
  return meterEntity;
});
