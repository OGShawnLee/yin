import type { UserShape } from "@business/schema/UserSchema";
import UserSchema from "@business/schema/UserSchema";

export default class UserDTO implements UserShape {
  public readonly id: string;
  public readonly name: string;
  public readonly location: string | null | undefined;
  public readonly description: string | null | undefined;
  public readonly createdAt: Date | null;
  public readonly displayName: string;

  public constructor(data: UserShape) {
    const validated = UserSchema.getValidUser(data);
    this.id = validated.id;
    this.name = validated.name;
    this.displayName = validated.displayName;
    this.location = validated.location;
    this.description = validated.description;
    this.createdAt = validated.createdAt ? new Date(validated.createdAt) : null;
  }
}