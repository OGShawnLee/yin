CREATE MIGRATION m1wahokjb2eclvaq6as7gz6dqvfvdb45zraxodfj3jfsrvk3wpfnsa
    ONTO m1vtborpttxbj5tgw4ukba5fxlivn75okhg2kcenhlp6t43cclk7oa
{
  ALTER TYPE default::Edit {
      DROP ACCESS POLICY prevent_edit_overflow;
  };
};
