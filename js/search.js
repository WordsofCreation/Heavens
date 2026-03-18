export function filterObjects(objects, query, category) {
  const normalized = query.trim().toLowerCase();
  return objects.filter((object) => {
    const matchesCategory = category === 'all' || object.category === category;
    const matchesQuery =
      !normalized ||
      [
        object.name,
        object.category,
        object.type,
        object.constellation,
        object.summary,
        object.spectralClass,
        object.color,
        object.importance,
        object.lightStory,
        ...(object.scienceFacts || [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    return matchesCategory && matchesQuery;
  });
}

export function getCategories(objects) {
  return ['all', ...new Set(objects.map((object) => object.category))];
}

export function sortObjects(objects, sortBy) {
  const sorted = [...objects];
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  sorted.sort((left, right) => {
    if (sortBy === 'distance') {
      return (left.distanceLightYears ?? Number.MAX_SAFE_INTEGER) - (right.distanceLightYears ?? Number.MAX_SAFE_INTEGER);
    }

    if (sortBy === 'brightness') {
      return (left.apparentMagnitude ?? Number.MAX_SAFE_INTEGER) - (right.apparentMagnitude ?? Number.MAX_SAFE_INTEGER);
    }

    if (sortBy === 'type') {
      return collator.compare(left.type, right.type) || collator.compare(left.name, right.name);
    }

    return collator.compare(left.name, right.name);
  });

  return sorted;
}
