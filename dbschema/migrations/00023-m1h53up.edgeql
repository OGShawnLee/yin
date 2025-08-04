CREATE MIGRATION m1h53upj77kkdsyakfkonmg62gfhdd44fipulpkol6hch56nlxedka
    ONTO m1pj2qghnw243uoad6c35lwecivqte47ri3uviykwq46gz2pxti4hq
{
  ALTER TYPE default::Repost {
      ALTER LINK repostOf {
          RENAME TO post;
      };
  };
};
