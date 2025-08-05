CREATE MIGRATION m156u3cc5ri2wdpjkz6ifxrx5d2qpgcum4pcfdydn3aijsuer3buja
    ONTO m1h53upj77kkdsyakfkonmg62gfhdd44fipulpkol6hch56nlxedka
{
  ALTER TYPE default::Post {
      CREATE LINK quoteOf: default::Post {
          ON TARGET DELETE ALLOW;
      };
      CREATE REQUIRED PROPERTY quoteCount: std::int32 {
          SET default := 0;
          CREATE REWRITE
              INSERT 
              USING (0);
      };
  };
  ALTER SCALAR TYPE default::NotificationKind EXTENDING enum<Favourite, Follow, Repost, Quote>;
};
