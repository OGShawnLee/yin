import AuthClient from '@business/auth/AuthClient.js';
import NotificationDAO from '@db/dao/NotificationDAO';
import { error } from '@sveltejs/kit';

export async function load(event) {
  const { data, error: err } = await NotificationDAO.getAll(
    await AuthClient.getAuthPayloadFromCookies(event.cookies)
  );

  if (err) {
    error(500, { message: err.message })
  }

  return { notificationList: data }
}