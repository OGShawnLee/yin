CREATE MIGRATION m17i2owx5btbmsb6r2xshaumvfde7evadqflk2vnbz2p3zmrmbkftq
    ONTO m12d3moa3kia2mgmbe6zmm7kflxysjmawllwla3xvvlwrd5idlr4lq
{
  ALTER TYPE default::Account {
      ALTER PROPERTY email {
          CREATE CONSTRAINT std::max_len_value(128);
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY email {
          DROP CONSTRAINT std::max_len_value(64);
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY email {
          CREATE CONSTRAINT std::min_len_value(3);
      };
  };
  ALTER TYPE default::User {
      ALTER LINK account {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
};
