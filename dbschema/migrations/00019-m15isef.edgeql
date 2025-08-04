CREATE MIGRATION m15isefrnqlk35vkpjb74iq2ywu4b24eiyqxwjbgujpgutaa2dtrha
    ONTO m1ybsy2b3v24dv6uxqg2sxt3yq3c46p2i3hqtpfuawbbta6sihfjpa
{
  ALTER SCALAR TYPE default::NotificationKind EXTENDING enum<Favourite, Follow, Repost>;
};
