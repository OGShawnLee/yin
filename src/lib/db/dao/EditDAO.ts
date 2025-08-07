import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import { getClient } from "@db/DBClient";

export default class EditDAO {
  public static getAll(id: string) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Edit, (edit) => ({
        id: true,
        previousContent: true,
        createdAt: true,
        filter: e.op(edit.post.id, '=', e.uuid(id)),
      })).run(getClient());
    });
  }
}