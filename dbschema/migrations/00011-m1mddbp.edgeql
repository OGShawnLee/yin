CREATE MIGRATION m1mddbpkojafv5ehv6sci4fpdd47zpqchouo6cdbi32nu3nq3s2gpa
    ONTO m1o5tnhdpvpxwteqeddmu2l6voqy7y65zde4qucdvv2ejtfmqa56ha
{
  CREATE GLOBAL default::currentUserDisplayName -> std::str;
  ALTER TYPE default::Post {
      CREATE PROPERTY isBookmarked := (SELECT
          EXISTS ((SELECT
              default::Bookmark
          FILTER
              ((.post.id = default::Post.id) AND (.user.displayName = GLOBAL default::currentUserDisplayName))
          ))
      );
  };
};
