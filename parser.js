/**
 * 生成路径名
 * @param {*} pathArr 路径
 */
function getDirName(pathArr) {
  return pathArr
    .map((path, index) => {
      if (index === 0) {
        return path;
      }
      return path.charAt(0).toUpperCase() + path.slice(1);
    })
    .join("");
}
/**
 * 删除数组两端的空元素
 * @param {*} arr
 */
function trimArray(arr) {
  if (!arr || arr.length === 0) {
    return arr;
  }
  function isEmpty(value) {
    return value == undefined || value === "";
  }
  const len = arr.length;
  if (!isEmpty(arr[0]) && !isEmpty(arr[len - 1])) {
    return arr;
  }
  let start = 0;
  let end = len - 1;
  for (; start < end; ) {
    if (isEmpty(arr[start])) {
      start += 1;
    } else if (isEmpty(arr[end])) {
      end -= 1;
    } else {
      break;
    }
  }
  return arr.slice(start, end + 1);
}

function parser(basePath, path, reqs) {
  let pathArr = path.replace(basePath, "").split("/");
  pathArr = trimArray(pathArr);
  const fileName = pathArr.pop();
  const dirName = getDirName(pathArr);
  const keys = Object.keys(reqs);
  return keys.map((key) => {
    const req = reqs[key];
    return {
      summary: req.summary,
      method: key,
      fileName,
      dirName,
      url: path.replace(basePath, ""),
      params: req.parameters,
      doc: req,
    };
  });
}

module.exports = parser;
