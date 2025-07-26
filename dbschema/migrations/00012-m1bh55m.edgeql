CREATE MIGRATION m1bh55mgvip7mg5wlozt6xssw2by5z7ukel2kuggudqxvxfufrch2q
    ONTO m1mddbpkojafv5ehv6sci4fpdd47zpqchouo6cdbi32nu3nq3s2gpa
{
  CREATE TYPE default::Favourite EXTENDING default::Record {
      CREATE REQUIRED LINK post: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE CONSTRAINT std::exclusive ON ((.user, .post));
      CREATE REQUIRED PROPERTY favouritedAt: std::datetime {
          SET default := (std::datetime_of_statement());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Post {
      CREATE PROPERTY isLiked := (SELECT
          EXISTS ((SELECT
              default::Favourite
          FILTER
              ((.post.id = default::Post.id) AND (.user.displayName = GLOBAL default::currentUserDisplayName))
          ))
      );
      CREATE REQUIRED PROPERTY favouriteCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  ALTER TYPE default::Favourite {
      CREATE TRIGGER decrement_favourite_count
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __old__.post.id)
          SET {
              favouriteCount := (.favouriteCount - 1)
          });
      CREATE TRIGGER increment_favourite_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.post.id)
          SET {
              favouriteCount := (.favouriteCount + 1)
          });
  };
};
