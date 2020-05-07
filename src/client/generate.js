const fs = require("fs");
const path = require("path");
const builder = require("../../index");
const CheckFileList = [".service-config.json", "Template.js"];

module.exports = function generate() {
  for (let file of CheckFileList) {
    if (!fs.existsSync(path.resolve(process.cwd(), file))) {
      console.error(`无法生成，缺少文件：${file}`);
      return;
    }
  }
  builder.run();
};
