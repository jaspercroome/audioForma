const chunk = (array, size) => {
  var arrays = [];
  for (var i = 0, len = array.length; i < len; i += size)
    arrays.push(array.slice(i, i + size));
  return arrays;
};

export { chunk };
