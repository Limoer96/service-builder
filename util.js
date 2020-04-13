const fs = require("fs").promises;

function isEmpty(value) {
  return value == undefined || value === "";
}

function writeFile(fileName, content) {
  if (!fileName || isEmpty(content)) {
    return;
  }
  fs.writeFile(fileName, content).catch((err) => {
    console.error("写入文件错误", err.message);
  });
}

exports.writeFile = writeFile;
