const utils = require("./util");
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

function parser(basePath, path, reqs) {
  let pathArr = path.replace(basePath, "").split("/");
  pathArr = utils.trimArray(pathArr);
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
