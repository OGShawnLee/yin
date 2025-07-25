CREATE MIGRATION m1su6ozx6pmylatcgge3zb3o6i7ktompstvcd7k2cg4gzdihfh2ioq
    ONTO m1ivdnz5iaensjk3nyy7viapgraf5pcuu6wpwdw7sw3yxf4c4ktsla
{
  ALTER TYPE default::Bookmark {
      ALTER TRIGGER increment_bookmark_count USING (UPDATE
          default::Post
      FILTER
          (.id = __new__.post.id)
      SET {
          bookmarkCount := (.bookmarkCount + 1)
      });
  };
};
