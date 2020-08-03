import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { MeterReadingEntity } from "../entity/MeterReadingEntity";
import * as path from "path";
import { MeterEntity } from "../entity/MeterEntity";
import * as _ from "lodash";
import * as load from "csv-load-sync";

const FILE_PATH = path.join(__dirname, "metering_data.csv");

function split(line, lineNumber) {
  if (lineNumber === 0) {
    return line.split(",");
  }
  var parts = line.split(",");
  return parts;
}
var results: any[] = load(FILE_PATH, {
  getColumns: split,
});

export class CreateMeterAndReadings implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const transformedResults = _.chain(results)
      // Group the elements of Array based on `color` property
      .groupBy("Serial")
      // `key` is group's name (color), `value` is the array of objects
      .map((value, key) => ({ serial: key, readings: value }))
      .value();
    if (connection && connection.isConnected) {
      for (let i = 0; i < transformedResults.length; i++) {
        await factory(MeterEntity)(transformedResults[i]).create();
      }
      const meterEntities = await MeterEntity.find();
      for (let i = 0; i < results.length; i++) {
        const meterEntity = meterEntities.find(
          (meterEntity) => meterEntity.name === results[i]["Serial"]
        );

        if (meterEntity) {
          await factory(MeterReadingEntity)({
            row: results[i],
            meterEntity: meterEntity,
          }).create();
        }
      }
    }
  }
}
