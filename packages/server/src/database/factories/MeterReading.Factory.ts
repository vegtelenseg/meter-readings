import { define, factory } from "typeorm-seeding";

import { MeterEntity } from "../../entity/MeterEntity";
import { MeterReadingEntity } from "../../entity/MeterReadingEntity";

const createDate = (dateTimeString: string) => {
  const dateTimeArray = dateTimeString.split(" ");
  const date = dateTimeArray[0];
  const time = dateTimeArray[1];
  const dateArray = date.split("/");
  const timeArray = time.split(":");
  const dateTimeUTC = Date.UTC(
    Number(dateArray[2]),
    Number(dateArray[1]),
    Number(dateArray[0]),
    Number(timeArray[0]),
    Number(timeArray[1])
  );
  return dateTimeUTC;
};

define(MeterReadingEntity, (_, { row, meterEntity }) => {
  const readingEntityObject = new MeterReadingEntity();
  readingEntityObject.varh = row["VARH"];
  readingEntityObject.wh = row["WH"];
  const dateTimeString: string = row["ReadingDateTimeUTC"];
  // TODO: Ensure dateTimeString indeed is defined
  const dateTimeUTC = createDate(dateTimeString);
  const date = new Date(dateTimeUTC);
  readingEntityObject.createdAt = date.toISOString();
  readingEntityObject.meter = meterEntity;
  return readingEntityObject;
});
