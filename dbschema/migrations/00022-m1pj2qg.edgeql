CREATE MIGRATION m1pj2qghnw243uoad6c35lwecivqte47ri3uviykwq46gz2pxti4hq
    ONTO m1qbymcfj2gcf2a3qdapk75csiiiwsyce65ye56aeddvyalufkdaha
{
  CREATE TYPE default::Repost EXTENDING default::Record {
      CREATE REQUIRED LINK repostOf: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE TRIGGER create_repost_post
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Post
              {
                  author := __new__.user,
                  content := __new__.repostOf.content,
                  repostOf := __new__.repostOf
              });
      CREATE TRIGGER decrement_repost_count
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __old__.repostOf.id)
          SET {
              repostCount := (.repostCount - 1)
          });
      CREATE TRIGGER increment_repost_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.repostOf.id)
          SET {
              repostCount := (.repostCount + 1)
          });
      CREATE TRIGGER notify_post_author
          AFTER INSERT 
          FOR EACH 
              WHEN ((__new__.repostOf.author.id != __new__.user.id))
          DO (INSERT
              default::Notification
              {
                  from := __new__.user,
                  user := __new__.repostOf.author,
                  post := __new__.repostOf,
                  kind := default::NotificationKind.Repost
              });
  };
  ALTER TYPE default::Post {
      ALTER PROPERTY isReposted {
          USING (EXISTS ((SELECT
              default::Repost
          FILTER
              ((.repostOf.id = default::Post.id) AND (.user.displayName = GLOBAL default::currentUserDisplayName))
          )));
      };
      DROP TRIGGER increment_repost_count;
      DROP TRIGGER notify_post_author_on_repost;
  };
};
