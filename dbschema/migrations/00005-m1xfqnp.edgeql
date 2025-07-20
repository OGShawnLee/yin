CREATE MIGRATION m1xfqnpeidahb5vnap4lavi3lpvmahqrrplrk375uctitf7vnp6tpa
    ONTO m17i2owx5btbmsb6r2xshaumvfde7evadqflk2vnbz2p3zmrmbkftq
{
  CREATE TYPE default::Post EXTENDING default::Record {
      CREATE REQUIRED LINK author: default::User {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY content: std::str {
          CREATE CONSTRAINT std::max_len_value(512);
          CREATE CONSTRAINT std::min_len_value(16);
      };
  };
};
