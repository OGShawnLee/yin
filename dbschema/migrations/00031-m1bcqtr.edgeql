CREATE MIGRATION m1bcqtrou2epdhruxwxvw4fohwg6436wt6nzu4jl4almdlkie5unaq
    ONTO m1wahokjb2eclvaq6as7gz6dqvfvdb45zraxodfj3jfsrvk3wpfnsa
{
  ALTER TYPE default::Edit {
      DROP TRIGGER increment_edit_count;
      DROP TRIGGER update_post_updated_at;
  };
  ALTER TYPE default::Post {
      ALTER PROPERTY editCount {
          CREATE REWRITE
              UPDATE 
              USING (((__subject__.editCount + 1) IF (__subject__.content != __old__.content) ELSE __subject__.editCount));
      };
      ALTER PROPERTY updatedAt {
          CREATE REWRITE
              UPDATE 
              USING ((std::datetime_of_statement() IF (__subject__.content != __old__.content) ELSE __subject__.updatedAt));
      };
      CREATE TRIGGER handle_content_edit
          AFTER UPDATE 
          FOR EACH 
              WHEN (((__old__.content != __new__.content) AND __old__.hasEditAvailable))
          DO (INSERT
              default::Edit
              {
                  user := __old__.user,
                  post := __old__,
                  previousContent := __old__.content
              });
  };
};
