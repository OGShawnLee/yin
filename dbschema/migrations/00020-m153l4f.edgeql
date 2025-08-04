CREATE MIGRATION m153l4fkwlbsmrgik3t3ei25cxs4yalxd3ohm6it2kzox4e6lrrzoa
    ONTO m15isefrnqlk35vkpjb74iq2ywu4b24eiyqxwjbgujpgutaa2dtrha
{
  ALTER TYPE default::Post {
      CREATE LINK repostOf: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY isReposted := (SELECT
          EXISTS ((SELECT
              default::Post
          FILTER
              ((.repostOf.id = default::Post.id) AND (.author.displayName = GLOBAL default::currentUserDisplayName))
          ))
      );
      CREATE REQUIRED PROPERTY repostCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
      CREATE TRIGGER increment_repost_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.repostOf.id)
          SET {
              repostCount := (.repostCount + 1)
          });
      CREATE TRIGGER notify_post_author_on_repost
          AFTER INSERT 
          FOR EACH 
              WHEN (SELECT
                  (EXISTS (__new__.repostOf) AND (__new__.repostOf.author.id != __new__.author.id))
              )
          DO (INSERT
              default::Notification
              {
                  from := __new__.author,
                  user := __new__.repostOf.author,
                  post := __new__,
                  kind := default::NotificationKind.Repost
              });
      ALTER PROPERTY content {
          RESET OPTIONALITY;
      };
  };
};
