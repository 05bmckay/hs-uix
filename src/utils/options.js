export const buildOptions = (
  items,
  { labelKey = "label", valueKey = "value", descriptionKey, mapLabel, mapValue, mapDescription } = {}
) =>
  (items || []).map((item) => {
    const label = mapLabel ? mapLabel(item) : item?.[labelKey] ?? item;
    const value = mapValue ? mapValue(item) : item?.[valueKey] ?? item;
    const description = descriptionKey ? item?.[descriptionKey] : undefined;
    const mappedDescription = mapDescription ? mapDescription(item) : description;

    return mappedDescription == null
      ? { label, value }
      : { label, value, description: mappedDescription };
  });

export const findOptionLabel = (options, value, fallback = "") => {
  const match = (options || []).find((option) => option?.value === value);
  return match?.label ?? fallback;
};
