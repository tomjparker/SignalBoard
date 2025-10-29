export function moveItems(
  ids: string[],
  from: Item[],
  to: Item[],
  setFrom: SetItems,
  setTo: SetItems
) {
  if (ids.length === 0) return;

  const idSet = new Set(ids); // Using a set here ensures performance doesnt slow down as the list grows - its a bit like a hashtable which is 0(1)

  const picked: Item[] = [];
  const remainingFrom: Item[] = [];
  for (const it of from) {
    (idSet.has(it.id) ? picked : remainingFrom).push(it);
  }

  if (picked.length === 0) return;

  // Optional: prevent duplicates in the target
  const existing = new Set(to.map(i => i.id));
  const deduped = picked.filter(i => !existing.has(i.id));

  setFrom(remainingFrom);
  setTo(prev => [...prev, ...deduped]);
}

