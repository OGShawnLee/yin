CREATE MIGRATION m1vtborpttxbj5tgw4ukba5fxlivn75okhg2kcenhlp6t43cclk7oa
    ONTO m16wi2l7pl2i5bv65xxx376ilaae4bjwah4lyzs4r4bwqbm354whvq
{
  ALTER TYPE default::Edit {
      ALTER ACCESS POLICY prevent_edit_overflow USING (WITH
          date := 
              std::datetime_of_statement()
      SELECT
          (((date - __subject__.createdAt) < <std::duration>'72 hours') AND (std::count((SELECT
              default::Edit
          FILTER
              ((.post.id = __subject__.post.id) AND (.user.id = __subject__.user.id))
          )) <= (SELECT
              (IF .user.isPro THEN 5 ELSE 3)
          )))
      );
  };
  ALTER TYPE default::Post {
      ALTER PROPERTY updatedAt {
          RESET default;
          DROP REWRITE
              INSERT ;
          };
      };
};
