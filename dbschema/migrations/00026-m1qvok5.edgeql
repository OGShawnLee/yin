CREATE MIGRATION m1qvok5o2mdsugkwp72yt4udmyolangrfhrizt6l4gmb5xakq54sma
    ONTO m1sjh4fyuc62zjjaafigmmgrqczewbfc7okwsxknmrmbndtfipi24q
{
  CREATE TYPE default::Quote EXTENDING default::Record {
      CREATE REQUIRED LINK quoteOf: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK post: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE TRIGGER notify_post_author
          AFTER INSERT 
          FOR EACH 
              WHEN ((__new__.post.user.id != __new__.user.id))
          DO (INSERT
              default::Notification
              {
                  from := __new__.user,
                  user := __new__.post.user,
                  post := __new__.post,
                  kind := default::NotificationKind.Quote
              });
      CREATE TRIGGER decrement_quote_count
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __old__.quoteOf.id)
          SET {
              quoteCount := (.quoteCount - 1)
          });
      CREATE TRIGGER increment_quote_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.quoteOf.id)
          SET {
              quoteCount := (.quoteCount + 1)
          });
  };
  ALTER TYPE default::Post {
      CREATE PROPERTY isQuoted := (EXISTS ((SELECT
          default::Quote
      FILTER
          ((.quoteOf.id = default::Post.id) AND (.user.displayName = GLOBAL default::currentUserDisplayName))
      )));
  };
};
