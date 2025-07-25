import AuthClient from '@business/auth/AuthClient';

export async function load(event) {
  const currentUser = await AuthClient.findCurrentUserFromDB(event.cookies);
  return {
    currentUser: currentUser.data, 
    path: event.url.pathname
  };
}