CREATE MIGRATION m1oiwdiejp2lswt54vhswgbppgo4sus2vqgkuufxjxcw5r66x7t6hq
    ONTO m1ytqihyzvqpebcmvupvyiel26eorkyeb3x2qutudaknqlwdleltsq
{
  ALTER TYPE default::Draft {
      CREATE LINK quoteOf: default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY updatedAt: std::datetime {
          CREATE REWRITE
              UPDATE 
              USING ((std::datetime_of_statement() IF (__subject__.content != __old__.content) ELSE __subject__.updatedAt));
      };
  };
};
