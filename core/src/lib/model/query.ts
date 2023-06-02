import { Operation } from "./operation";
import { v4 as uuidv4 } from "uuid";

export class Query {
  public tasks: { key: string, task: string }[] = []
  constructor(
    public ast: Operation = new Operation(
      "AND",
      [],
      "main",
      "haupt",
      "main"
    ),
    public id?: string,
  ) {
    if (id == undefined) {
      let uuid = uuidv4();
      this.id = `${uuid}__search__${uuid}`
    }
  }
}
