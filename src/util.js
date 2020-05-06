const fs = require("fs");
const path = require("path");

const fsp = fs.promises;
function isEmpty(value) {
  return value == undefined || value === "";
}
/**
 * 写入文件
 * @param {string} fileName 文件名
 * @param {string} content 文本内容
 */
function writeFile(fileName, content) {
  if (!fileName || isEmpty(content)) {
    return;
  }
  fsp.writeFile(fileName, content).catch((err) => {
    console.error("写入文件错误", err.message);
  });
}
/**
 * 删除数组两端的空元素
 * @param {*} arr
 */
function trimArray(arr) {
  if (!arr || arr.length === 0) {
    return arr;
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

function findFilePath(dir, fileName) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const cName = path.join(dir, file);
    const stats = fs.lstatSync(cName);
    if (stats.isDirectory()) {
      if (file === ".git" || file === "node_modules") {
        continue;
      }
      const result = findFilePath(cName, fileName);
      if (result) {
        return result;
      }
    } else if (stats.isFile() && file === fileName) {
      return cName;
    }
  }
}

function isTypeScript() {
  const ext = global.SERVICE_CONFIG ? global.SERVICE_CONFIG.ext : "";
  if (!ext) {
    return false;
  }
  return ext === ".ts";
}

// exports.getTypeQueryParams = function getTypeQueryParams(paramsList = []) {
//   if (!paramsList || paramsList.length === 0) {
//     return "";
//   }
//   return paramsList
//     .map((param) => {
//       const { description, name, required, type } = param;
//       reutrn`
//       /** ${description} */
//       ${name}${required ? "" : "?"}: ${type}\n
//     `;
//     })
//     .join("");
// };

exports.findFilePath = findFilePath;

exports.CONFIG_FILE = ".service-config.json";

exports.trimArray = trimArray;

exports.writeFile = writeFile;

exports.isTypeScript = isTypeScript;
