export function filterObjects(objects, query, category) {
  const normalized = query.trim().toLowerCase();
  return objects.filter((object) => {
    const matchesCategory = category === 'all' || object.type === category;
    const matchesQuery =
      !normalized ||
      [object.name, object.type, object.constellation, object.description, object.spectralClass]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    return matchesCategory && matchesQuery;
  });
}

export function getCategories(objects) {
  return ['all', ...new Set(objects.map((object) => object.type))];
}
