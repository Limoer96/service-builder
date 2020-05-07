const fs = require("fs").promises;
const http = require("http");
const traverse = require("./src/traverse");
const genDefinitions = require("./src/definitions");
const Template = require("./src/template");
const utils = require("./src/util");
const path = require("path");

function readDoc(fileName) {
  fs.readFile(fileName, "utf-8")
    .then((file) => {
      const doc = JSON.parse(file);
      if (utils.isTypeScript()) {
        genDefinitions(doc);
      }
      traverse(doc);
    })
    .catch((error) => {
      console.error("出现错误：", error);
    });
}

function getDocOrigin(url) {
  http
    .get(url, (res) => {
      const { statusCode } = res;
      if (res.statusCode !== 200) {
        console.error(`请求失败，请重试，code：${statusCode}`);
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
          if (utils.isTypeScript()) {
            genDefinitions(doc);
          }
          traverse(doc);
        } catch (e) {
          console.error(`出现了错误：${e}`);
        }
      });
    })
    .on("error", (err) => {
      console.error(`出现了错误：${err}`);
    });
}

function run() {
  fs.readFile(
    utils.findFilePath(process.cwd(), utils.CONFIG_FILE),
    "utf-8"
  ).then((file) => {
    const config = JSON.parse(file);
    global.SERVICE_CONFIG = config; // 存储到全局
    if (config.originUrl) {
      getDocOrigin(config.originUrl);
    } else {
      readDoc(path.resolve(process.cwd(), config.sourcePath));
    }
  });
}

exports.Template = Template;

exports.run = run;
