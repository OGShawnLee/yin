CREATE MIGRATION m1fk56u4uqxkwyfroxg5fnvmrq72tslz7odfk33onfou2c7hosxfqq
    ONTO m14egg6hqgxksjwvy5a6rpf27qbb2lo3akxnlw3tmtbwgpaezezzoq
{
  CREATE TYPE default::Follow EXTENDING default::Record {
      CREATE REQUIRED LINK followee: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK follower: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE CONSTRAINT std::exclusive ON ((.follower, .followee));
  };
  ALTER TYPE default::User {
      CREATE PROPERTY isFollowing := (SELECT
          EXISTS ((SELECT
              default::Follow
          FILTER
              ((.follower.displayName = GLOBAL default::currentUserDisplayName) AND (.followee.id = default::User.id))
          ))
      );
      CREATE REQUIRED PROPERTY followerCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  ALTER TYPE default::Follow {
      CREATE TRIGGER decrement_followee_followers
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::User
          FILTER
              (.id = __old__.followee.id)
          SET {
              followerCount := (.followerCount - 1)
          });
      CREATE TRIGGER increment_followee_followers
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::User
          FILTER
              (.id = __new__.followee.id)
          SET {
              followerCount := (.followerCount + 1)
          });
  };
};
