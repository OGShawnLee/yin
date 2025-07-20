CREATE MIGRATION m16e7s7m3b5jfpyxadunronhdpfmsfhzpx3jg5kuvum66736ggr3lq
    ONTO m1avwun57faibixfha2qrqkoom62msbauithnpqmkvckmcsnvmxn2a
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY name: std::str {
          SET REQUIRED USING (<std::str>'Shawn Lee');
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(64);
          CREATE CONSTRAINT std::min_len_value(3);
      };
  };
};
