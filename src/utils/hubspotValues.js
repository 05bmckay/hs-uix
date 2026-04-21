export const isDateValueObject = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof value.year === "number" &&
      typeof value.month === "number" &&
      typeof value.date === "number"
  );

export const isTimeValueObject = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof value.hours === "number" &&
      typeof value.minutes === "number"
  );

export const isDateTimeValueObject = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      (value.date == null || isDateValueObject(value.date)) &&
      (value.time == null || isTimeValueObject(value.time))
  );
