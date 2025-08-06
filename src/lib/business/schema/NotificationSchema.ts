import type { InferOutput } from 'valibot';
import Schema from '@business/schema/Schema';
import AuthSchema from '@business/schema/AuthSchema';
import { boolean, nullable, object, parse, picklist } from 'valibot';

export type NotificationShape = InferOutput<typeof NotificationSchema.NOTIFICATION_SCHEMA>;

export default class NotificationSchema {
  public static NOTIFICATION_SCHEMA = object({
    id: Schema.ID_SCHEMA,
    isRead: boolean('Notification read status must be a boolean.'),
    post: nullable(
      object({ id: Schema.ID_SCHEMA })
    ),
    kind: picklist(["Favourite", "Follow", "Repost", "Quote"], "Kind must be a valid notification kind."),
    from: AuthSchema.CURRENT_USER_SCHEMA,
    createdAt: Schema.CREATED_AT_SCHEMA,
  });

  public static getValidNotification(data: unknown): NotificationShape {
    return parse(this.NOTIFICATION_SCHEMA, data);
  }
}