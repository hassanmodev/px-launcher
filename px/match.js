function fuzzyMatch(query, str) {
  query = query.toLowerCase();
  str = str.toLowerCase();
  if (str.includes(query)) return true;
  let qi = 0;
  for (let i = 0; i < str.length && qi < query.length; i++) {
    if (str[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

function findProject(projects, name) {
  const exact = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (exact) return exact;
  const matches = projects.filter(p => fuzzyMatch(name, p.name));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.log(`Multiple matches for "${name}":`);
    matches.forEach((p, i) => console.log(`  ${i + 1}. ${p.name}`));
    return null;
  }
  return null;
}

module.exports = { fuzzyMatch, findProject };
