CREATE MIGRATION m1ivdnz5iaensjk3nyy7viapgraf5pcuu6wpwdw7sw3yxf4c4ktsla
    ONTO m14fcquvg5s4yxzxqaqfq3pnufb32lvt2y3i5xilwx7427grpxyc6q
{
  ALTER TYPE default::Bookmark {
      CREATE CONSTRAINT std::exclusive ON ((.user, .post));
      ALTER LINK post {
          DROP CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY bookmarkedAt: std::datetime {
          SET default := (std::datetime_of_statement());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Post {
      CREATE REQUIRED PROPERTY bookmarkCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  ALTER TYPE default::Bookmark {
      CREATE TRIGGER increment_bookmark_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.id)
          SET {
              bookmarkCount := (.bookmarkCount + 1)
          });
  };
};
