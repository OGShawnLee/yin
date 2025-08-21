// Mock EdgeQL query builder for testing
export const e = {
  insert: () => ({ run: () => Promise.resolve({}) }),
  select: () => ({ run: () => Promise.resolve({}) }),
  update: () => ({ run: () => Promise.resolve({}) }),
  delete: () => ({ run: () => Promise.resolve({}) }),
  shape: () => ({}),
  op: () => ({}),
  uuid: (id: string) => id,
  DESC: 'DESC',
  User: {},
  Post: {},
  Draft: {},
  Account: {},
  Follow: {},
  Edit: {},
  Favourite: {},
  Bookmark: {},
  Repost: {},
  Quote: {},
  Notification: {}
};

export default e;