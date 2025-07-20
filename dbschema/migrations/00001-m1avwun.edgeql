CREATE MIGRATION m1avwun57faibixfha2qrqkoom62msbauithnpqmkvckmcsnvmxn2a
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE ABSTRACT TYPE default::Record {
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::Account EXTENDING default::Record {
      CREATE REQUIRED PROPERTY password: std::str {
          CREATE CONSTRAINT std::max_len_value(64);
          CREATE CONSTRAINT std::min_len_value(8);
      };
      CREATE REQUIRED PROPERTY refreshTokenVersion: std::int32 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  CREATE TYPE default::User EXTENDING default::Record {
      CREATE REQUIRED LINK account: default::Account {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY description: std::str {
          CREATE CONSTRAINT std::max_len_value(256);
      };
      CREATE REQUIRED PROPERTY displayName: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(16);
          CREATE CONSTRAINT std::min_len_value(3);
      };
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(64);
      };
      CREATE PROPERTY location: std::str {
          CREATE CONSTRAINT std::max_len_value(64);
          CREATE CONSTRAINT std::min_len_value(2);
      };
  };
};
