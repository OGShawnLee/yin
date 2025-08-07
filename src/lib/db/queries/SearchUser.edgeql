with matches := (fts::search(User, <str>$query, language := 'eng'))
select matches.object {
  id,
  name, 
  displayName,
  description,
  isPro,
  isFounder,
  isStaff, 
  score := matches.score
} order by matches.score desc;