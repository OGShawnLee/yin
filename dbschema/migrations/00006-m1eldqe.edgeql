CREATE MIGRATION m1eldqe4tuovb4a3ehidvmsbdsjfgi3fflv3lpfgunzn6iydfkplvq
    ONTO m1xfqnpeidahb5vnap4lavi3lpvmahqrrplrk375uctitf7vnp6tpa
{
  ALTER TYPE default::Post {
      ALTER LINK author {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
