export const sumBy = (items, keyOrFn) =>
  (items || []).reduce((total, item) => {
    const value =
      typeof keyOrFn === "function"
        ? keyOrFn(item)
        : item?.[keyOrFn];

    return total + Number(value || 0);
  }, 0);
