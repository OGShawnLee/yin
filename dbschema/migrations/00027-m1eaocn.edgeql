CREATE MIGRATION m1eaocnojdlyjv353xhdp634avyzdnj6fww5apwvmghbssuc626yna
    ONTO m1qvok5o2mdsugkwp72yt4udmyolangrfhrizt6l4gmb5xakq54sma
{
  ALTER TYPE default::Post {
      ALTER PROPERTY content {
          CREATE CONSTRAINT std::max_len_value(1024);
      };
  };
  ALTER TYPE default::Post {
      ALTER PROPERTY content {
          DROP CONSTRAINT std::max_len_value(512);
      };
  };
};
