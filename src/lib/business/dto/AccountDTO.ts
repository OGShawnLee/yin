import { YinAuthCrypto } from "$lib/YinAuth";
import type { Account } from "$lib/business/schema/AccountSchema";
import AccountSchema from "$lib/business/schema/AccountSchema";
import type { CurrentUserShape } from "@business/schema/AuthSchema";

export default class AccountDTO implements Account {
  public readonly id: string;
  public readonly name: string;
  public readonly displayName: string;
  public readonly isPro: boolean;
  public readonly password: string;
  public readonly email: string;
  public readonly refreshTokenVersion: number;
  public readonly createdAt: Date | null;

  public constructor(data: Account) {
    const validated = AccountSchema.getValidAccount(data);
    this.id = validated.id;
    this.name = validated.name;
    this.displayName = validated.displayName;
    this.isPro = validated.isPro;
    this.password = validated.password;
    this.email = validated.email;
    this.refreshTokenVersion = validated.refreshTokenVersion;
    this.createdAt = validated.createdAt ? new Date(validated.createdAt) : null;
  }
  
  public toCurrentUser(): CurrentUserShape {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      isPro: this.isPro
    };
  }

  public hasPasswordMatch(candidate: string): Promise<boolean> {
    return YinAuthCrypto.hasPasswordMatch(candidate, this.password);
  }
}