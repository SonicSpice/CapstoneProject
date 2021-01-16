function isDateFormatValid(testdate) {
  var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return date_regex.test(testdate);
}

export { isDateFormatValid };
