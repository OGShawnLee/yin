CREATE MIGRATION m14qdmj2xdzaoafdbpjd2nrxruhnclxba25vkm6czg6ziw2kqmak6a
    ONTO m1bcqtrou2epdhruxwxvw4fohwg6436wt6nzu4jl4almdlkie5unaq
{
  ALTER TYPE default::Post {
      CREATE INDEX std::fts::index ON (std::fts::with_options(.content, language := std::fts::Language.spa, weight_category := std::fts::Weight.A));
  };
  ALTER TYPE default::User {
      CREATE INDEX std::fts::index ON ((std::fts::with_options(.displayName, language := std::fts::Language.eng, weight_category := std::fts::Weight.A), std::fts::with_options(.name, language := std::fts::Language.eng, weight_category := std::fts::Weight.B), std::fts::with_options(.description, language := std::fts::Language.eng, weight_category := std::fts::Weight.C)));
  };
};
