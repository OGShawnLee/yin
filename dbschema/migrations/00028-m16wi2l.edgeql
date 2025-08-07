CREATE MIGRATION m16wi2l7pl2i5bv65xxx376ilaae4bjwah4lyzs4r4bwqbm354whvq
    ONTO m1eaocnojdlyjv353xhdp634avyzdnj6fww5apwvmghbssuc626yna
{
  CREATE TYPE default::Edit EXTENDING default::Record {
      CREATE REQUIRED LINK post: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE ACCESS POLICY prevent_edit_overflow
          ALLOW INSERT USING (WITH
              date := 
                  std::datetime_of_statement()
          SELECT
              (((date - .createdAt) < <std::duration>'72 hours') AND (std::count((SELECT
                  default::Edit
              FILTER
                  ((.post.id = __subject__.post.id) AND (.user.id = __subject__.user.id))
              )) <= (SELECT
                  (IF .user.isPro THEN 5 ELSE 3)
              )))
          );
      CREATE REQUIRED PROPERTY previousContent: std::str {
          CREATE CONSTRAINT std::max_len_value(1024);
          CREATE CONSTRAINT std::min_len_value(16);
      };
  };
  ALTER TYPE default::Post {
      CREATE REQUIRED PROPERTY editCount: std::int16 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
      CREATE PROPERTY updatedAt: std::datetime {
          SET default := (std::datetime_of_statement());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY hasEditAvailable := (WITH
          date := 
              std::datetime_of_statement()
      SELECT
          ((((date - .createdAt) < <std::duration>'72 hours') AND (.user.displayName = GLOBAL default::currentUserDisplayName)) AND (.editCount <= (SELECT
              (IF .user.isPro THEN 5 ELSE 3)
          )))
      );
  };
  ALTER TYPE default::Edit {
      CREATE TRIGGER increment_edit_count
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.post.id)
          SET {
              editCount := (.editCount + 1)
          });
      CREATE TRIGGER update_post_updated_at
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Post
          FILTER
              (.id = __new__.post.id)
          SET {
              updatedAt := std::datetime_of_statement()
          });
  };
};
