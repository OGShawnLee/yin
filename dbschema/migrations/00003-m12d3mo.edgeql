CREATE MIGRATION m12d3moa3kia2mgmbe6zmm7kflxysjmawllwla3xvvlwrd5idlr4lq
    ONTO m16e7s7m3b5jfpyxadunronhdpfmsfhzpx3jg5kuvum66736ggr3lq
{
  ALTER TYPE default::Account {
      CREATE REQUIRED PROPERTY email: std::str {
          SET REQUIRED USING (<std::str>'OGShawnLee@gmail.com');
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(64);
      };
  };
  ALTER TYPE default::User {
      DROP PROPERTY email;
  };
};
