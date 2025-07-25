CREATE MIGRATION m1o5tnhdpvpxwteqeddmu2l6voqy7y65zde4qucdvv2ejtfmqa56ha
    ONTO m1su6ozx6pmylatcgge3zb3o6i7ktompstvcd7k2cg4gzdihfh2ioq
{
  ALTER TYPE default::Bookmark {
      CREATE TRIGGER decrement_bookmark_count
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __old__.post.id)
          SET {
              bookmarkCount := (.bookmarkCount - 1)
          });
  };
};
