import type { CurrentUserShape } from "$lib/business/schema/AuthSchema";
import ErrorHandler from "@common/ErrorHandler";
import AuthClientAdapter from "$lib/business/auth/AuthClientAdapter";
import { YinAuthClient } from "$lib/YinAuth";
import { ACCESS_TOKEN, ACCESS_TOKEN_NAME, REFRESH_TOKEN, REFRESH_TOKEN_NAME } from "$env/static/private";

const AuthClient = new YinAuthClient<CurrentUserShape, CurrentUserShape>(
  new AuthClientAdapter(),
  {
    ACCESS_TOKEN: ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRATION: "30Minutes",
    ACCESS_TOKEN_NAME: ACCESS_TOKEN_NAME,
    REFRESH_TOKEN: REFRESH_TOKEN,
    REFRESH_TOKEN_EXPIRATION: "3Days",
    REFRESH_TOKEN_NAME: REFRESH_TOKEN_NAME,
    SIGN_IN_ROUTE: "/auth/sign-in",
    SIGN_UP_ROUTE: "/auth/sign-up",
    PROTECTED_ROUTES: ["/bookmarks", "/post/compose"]
  },
  ErrorHandler
);

export default AuthClient;