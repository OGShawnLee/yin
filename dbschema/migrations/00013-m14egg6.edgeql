CREATE MIGRATION m14egg6hqgxksjwvy5a6rpf27qbb2lo3akxnlw3tmtbwgpaezezzoq
    ONTO m1bh55mgvip7mg5wlozt6xssw2by5z7ukel2kuggudqxvxfufrch2q
{
  ALTER TYPE default::Post {
      ALTER PROPERTY isLiked {
          RENAME TO isFavourite;
      };
  };
};
