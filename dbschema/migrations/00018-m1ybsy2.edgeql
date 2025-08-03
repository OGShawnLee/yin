CREATE MIGRATION m1ybsy2b3v24dv6uxqg2sxt3yq3c46p2i3hqtpfuawbbta6sihfjpa
    ONTO m1gwz3t7oozs432uahm4ontfxxee3w5hgmhic3cb4hrmfjvlcktqsq
{
  ALTER TYPE default::User {
      ALTER PROPERTY isFounder {
          SET default := false;
          RESET EXPRESSION;
          RESET CARDINALITY;
          SET TYPE std::bool;
          CREATE REWRITE
              INSERT 
              USING (false);
      };
      ALTER PROPERTY isPro {
          SET default := false;
          RESET EXPRESSION;
          RESET CARDINALITY;
          SET TYPE std::bool;
          CREATE REWRITE
              INSERT 
              USING (false);
      };
      ALTER PROPERTY isStaff {
          SET default := false;
          RESET EXPRESSION;
          RESET CARDINALITY;
          SET TYPE std::bool;
          CREATE REWRITE
              INSERT 
              USING (false);
      };
  };
};
