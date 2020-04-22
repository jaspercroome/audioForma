const chunk = (array, size) => {
  var arrays = [];
  for (var i = 0, len = array.length; i < len; i += size)
    arrays.push(array.slice(i, i + size));
  return arrays;
};

const unique = (array, identifier1, identifier2) => {
  let uniq = {};
  const finalArray = array.filter(
    // if object with specific identifier isn't in the 'uniq' object,
    // keep it in the final Array.
    obj =>
      !uniq[obj[identifier1][identifier2]] &&
      (uniq[obj[identifier1][identifier2]] = true)
  );
  return finalArray;
};
export { chunk, unique };
