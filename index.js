const fs = require("fs").promises;
const http = require("http");
const traverse = require("./src/traverse");
const Template = require("./src/template");
const utils = require("./src/util");

function readDoc(fileName) {
  fs.readFile(fileName, "utf-8")
    .then((file) => {
      const doc = JSON.parse(file);
      console.log("run this");
      traverse(doc);
    })
    .catch((error) => {
      console.log("读取文件出错：", error.message);
    });
}

function getDocOrigin(url) {
  http
    .get(url, (res) => {
      const { statusCode } = res;
      if (res.statusCode !== 200) {
        console.log(new Error(`请求失败，请重试，code：${statusCode}`));
        res.resume();
        return;
      }
      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const doc = JSON.parse(rawData);
          traverse(doc);
        } catch (e) {
          console.error(`解析文件出错：${e.message}`);
        }
      });
    })
    .on("error", (e) => {
      console.log(`出现了错误：${e.message}`);
    });
}

function run() {
  fs.readFile(
    utils.findFilePath(process.cwd(), utils.CONFIG_FILE),
    "utf-8"
  ).then((file) => {
    const config = JSON.parse(file);
    console.log("config", config);
    global.SERVICE_CONFIG = config; // 存储到全局
    if (config.originUrl) {
      getDocOrigin(config.originUrl);
    } else {
      readDoc(utils.findFilePath(process.cwd(), config.sourcePath));
    }
  });
}

exports.Template = Template;

exports.run = run;
