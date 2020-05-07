const fs = require("fs");
const path = require("path");
const readline = require("readline");
const CheckFileList = [".service-config.json", "Template.js"];

function createTemplate(fileList) {
  if (!fileList || fileList.length === 0) {
    return;
  }
  for (const file of fileList) {
    const readStream = fs.createReadStream(
      path.resolve(__dirname, `./templates/${file}`)
    );
    const writeStream = fs.createWriteStream(path.resolve(process.cwd(), file));
    readStream.pipe(writeStream);
    readStream.on("end", () => {
      console.log(`生成文件完成：${file}`);
    });
  }
}

module.exports = function prevCheckWork() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const result = [];
  for (let file of CheckFileList) {
    try {
      const isExist = fs.existsSync(path.resolve(process.cwd(), file));
      if (isExist) {
        result.push(file);
      }
    } catch (error) {}
  }
  if (result.length === 0) {
    createTemplate(CheckFileList);
    rl.close();
    return;
  }
  rl.question(
    `检测到文件${result.join("/")}已存在，是否覆盖? y/n `,
    (answer) => {
      if (answer === "y" || answer === "yes") {
        createTemplate(CheckFileList);
      } else {
        const files = CheckFileList.filter((file) => !result.includes(file));
        if (files.length > 0) {
          createTemplate(files);
        }
      }
      rl.close();
    }
  );
};
