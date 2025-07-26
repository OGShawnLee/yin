CREATE MIGRATION m1xjabi7mtw7hq2s5hjzhq3ewnjw7qovxogup4cbbyctxkfhpcaxhq
    ONTO m1fk56u4uqxkwyfroxg5fnvmrq72tslz7odfk33onfou2c7hosxfqq
{
  CREATE SCALAR TYPE default::NotificationKind EXTENDING enum<Favourite, Follow>;
  CREATE TYPE default::Notification EXTENDING default::Record {
      CREATE REQUIRED LINK from: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE LINK post: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY kind: default::NotificationKind;
      CREATE REQUIRED PROPERTY isRead: std::bool {
          SET default := false;
          CREATE REWRITE
              INSERT 
              USING (false);
      };
  };
  ALTER TYPE default::Favourite {
      CREATE TRIGGER notify_post_author
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Notification
              {
                  from := __new__.user,
                  user := __new__.post.author,
                  post := __new__.post,
                  kind := default::NotificationKind.Favourite
              });
  };
  ALTER TYPE default::User {
      CREATE PROPERTY followingCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  ALTER TYPE default::Follow {
      CREATE TRIGGER decrement_follower_following
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::User
          FILTER
              (.id = __old__.follower.id)
          SET {
              followingCount := (.followingCount - 1)
          });
      CREATE TRIGGER increment_follower_following
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::User
          FILTER
              (.id = __new__.follower.id)
          SET {
              followingCount := (.followingCount + 1)
          });
      CREATE TRIGGER notify_followee
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Notification
              {
                  from := __new__.follower,
                  user := __new__.followee,
                  kind := default::NotificationKind.Follow
              });
  };
};
