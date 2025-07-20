import AuthClient from '@business/auth/AuthClient';

export async function load(event) {
  const currentUser = await AuthClient.findAuthPayloadFromCookies(event.cookies);
  return {
    currentUser, path: event.url.pathname
  };
}