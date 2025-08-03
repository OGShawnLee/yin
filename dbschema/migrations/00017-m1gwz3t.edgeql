CREATE MIGRATION m1gwz3t7oozs432uahm4ontfxxee3w5hgmhic3cb4hrmfjvlcktqsq
    ONTO m13mopuqecq743433v5ripzusbkgztg4oo2uaatzcjcxkwxbxvisya
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY isFounder := (false);
      CREATE REQUIRED PROPERTY isPro := (false);
      CREATE REQUIRED PROPERTY isStaff := (false);
  };
};
