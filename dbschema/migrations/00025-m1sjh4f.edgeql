CREATE MIGRATION m1sjh4fyuc62zjjaafigmmgrqczewbfc7okwsxknmrmbndtfipi24q
    ONTO m156u3cc5ri2wdpjkz6ifxrx5d2qpgcum4pcfdydn3aijsuer3buja
{
  ALTER TYPE default::Post {
      ALTER LINK author {
          RENAME TO user;
      };
  };
};
