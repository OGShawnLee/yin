import type { CurrentUserShape } from "@business/schema/AuthSchema";
import NotificationSchema from "@business/schema/NotificationSchema";
import ErrorHandler from "@common/ErrorHandler";
import { getClient } from "@db/DBClient";
import e from "@db:qb";

export default class NotificationDAO {
  public static getAll(currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Notification, (notification) => ({
        id: true,
        isRead: true,
        kind: true,
        post: { id: true },
        from: { id: true, displayName: true, name: true },
        createdAt: true,
        filter: e.op(notification.user.displayName, "=", currentUser.displayName),
        order_by: { expression: notification.createdAt, direction: e.DESC },
      })).run(getClient(currentUser))
        .then(list => list.map(it => NotificationSchema.getValidNotification(it)));
    });
  }
}