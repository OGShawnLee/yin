import type { Account } from "@business/schema/AccountSchema";
import AccountDTO from "@business/dto/AccountDTO";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import e from "@db:qb";
import { UserDAO } from "@db/dao/UserDAO";
import { getClient } from "@db/DBClient";

export default class AccountDAO {
  public static async findOneByUserDisplayName(displayName: string) {
    return ErrorHandler.useAwait(async () => {
      const user = UserDAO.getOneReference(displayName);
      const candidate = await e.select({
        id: user.account.id,
        name: user.name,
        displayName: user.displayName,
        isPro: user.isPro,
        email: user.account.email,
        password: user.account.password,
        refreshTokenVersion: user.account.refreshTokenVersion,
        createdAt: user.createdAt,
      }).run(getClient());
      return candidate.id ? new AccountDTO(candidate as Account) : null;
    });
  }

  public static async getOneByUserDisplayName(displayName: string): Promise<AccountDTO> {
    const user = UserDAO.getOneReference(displayName);
    const candidate = await e.select({
      id: user.account.id,
      name: user.name,
      displayName: user.displayName,
      isPro: user.isPro,
      email: user.account.email,
      password: user.account.password,
      refreshTokenVersion: user.account.refreshTokenVersion,
      createdAt: user.createdAt,
    }).run(getClient());
    
    if (candidate.id) {
      return new AccountDTO(candidate as Account);
    }

    throw new NotFoundError("Unable to find Account with the provided email.");
  }
}
