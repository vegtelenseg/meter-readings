import { Resolver, Query, Arg } from "type-graphql";
import { MeterEntity } from "../entity/MeterEntity";

@Resolver()
export class MeterResolver {
  @Query((type) => [MeterEntity])
  async meters(@Arg("filter", { nullable: true }) filter?: string) {
    console.log("SEARCH: ", filter);
    return await MeterEntity.find({
      relations: ["readings"],
      where: {
        name: filter,
      },
    });
  }
}
