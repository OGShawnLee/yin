CREATE MIGRATION m1qbymcfj2gcf2a3qdapk75csiiiwsyce65ye56aeddvyalufkdaha
    ONTO m153l4fkwlbsmrgik3t3ei25cxs4yalxd3ohm6it2kzox4e6lrrzoa
{
  ALTER TYPE default::Post {
      ALTER PROPERTY isReposted {
          USING (EXISTS ((.repostOf.author.displayName = GLOBAL default::currentUserDisplayName)));
      };
  };
};
