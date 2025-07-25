CREATE MIGRATION m14fcquvg5s4yxzxqaqfq3pnufb32lvt2y3i5xilwx7427grpxyc6q
    ONTO m1eldqe4tuovb4a3ehidvmsbdsjfgi3fflv3lpfgunzn6iydfkplvq
{
  CREATE TYPE default::Bookmark EXTENDING default::Record {
      CREATE REQUIRED LINK post: default::Post {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
