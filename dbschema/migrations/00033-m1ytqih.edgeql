CREATE MIGRATION m1ytqihyzvqpebcmvupvyiel26eorkyeb3x2qutudaknqlwdleltsq
    ONTO m14qdmj2xdzaoafdbpjd2nrxruhnclxba25vkm6czg6ziw2kqmak6a
{
  CREATE TYPE default::Draft EXTENDING default::Record {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY content: std::str {
          CREATE CONSTRAINT std::max_len_value(1024);
          CREATE CONSTRAINT std::min_len_value(16);
      };
  };
};
