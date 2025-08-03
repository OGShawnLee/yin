CREATE MIGRATION m13mopuqecq743433v5ripzusbkgztg4oo2uaatzcjcxkwxbxvisya
    ONTO m1xjabi7mtw7hq2s5hjzhq3ewnjw7qovxogup4cbbyctxkfhpcaxhq
{
  ALTER TYPE default::Favourite {
      ALTER TRIGGER notify_post_author WHEN ((__new__.post.author.id != __new__.user.id));
  };
};
