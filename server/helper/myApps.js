exports.validation = (data) => {
  const error = {};

  if (!data.by) {
    error.by = 'The key "by" is required';
    return error;
  }

  //check if by is id or name
  if (data.by !== "id" && data.by !== "name") {
    error.by = 'Only values permitted for "by" are "id" and "name"';
  }

  //check if start is my-app-(number) or is a number
  if (data.start || data.start === 0) {
    if (
      (!/(my\-app\-\d{3})/g.test(data.start) &&
        typeof data.start !== "number") ||
      data.start < 1 ||
      data.start > 999 ||
      data.start === "my-app-000" ||
      data.start.toString().length > 10
    ) {
      error.start =
        'Only values permitted for "start" are numbers 1-999 and "my-app-001" - "my-app-999"';
    }
  }

  //check if the right values are used for end
  if (data.end || data.end === 0) {
    if (
      (!/(my\-app\-\d{3})/g.test(data.start) && typeof data.end !== "number") ||
      data.end < 1 ||
      data.end > 999 ||
      data.end === "my-app-000" ||
      data.end.toString().length > 10
    ) {
      error.end =
        'Only values permitted for "end" are numbers 1-999 and "my-app-001" - "my-app-999"';
    }
  }

  //check that max is a number between 1-999
  if (data.max || data.max === 0) {
    if (data.max < 1 || data.max > 999) {
      error.max = 'Only values permitted for "max" are 1-999';
    }
  }

  //checks if that order values are "asc" or "desc"
  if (data.order) {
    if (data.order !== "asc" && data.order !== "desc") {
      error.order = 'Only values permitted for order are "asc" and "desc"';
    }
  }

  return error;
};
