const path = require("path");
const fs = require("fs");
const renderer = require("./renderer");
const prettier = require("prettier");
const mkdirp = require("mkdirp");

function renderDefinitions(content) {
  const outDir = path.resolve(process.cwd(), global.SERVICE_CONFIG.outDir);
  mkdirp(outDir).then(() => {
    fs.writeFile(path.join(outDir, "api.d.ts"), content, (err) => {
      if (err) {
        console.error("生成定义文件失败", err);
      }
    });
  });
}

function getDefinitionsContent(doc) {
  if (doc && doc.definitions) {
    const definitions = doc.definitions;
    const keys = Object.keys(definitions);
    let content = "";
    if (keys.length > 0) {
      content = keys.map((key) => renderer(definitions[key])).join("");
    }
    content = `
      declare namespace defs {
        ${content}
      }
    `;
    // return content;
    return prettier.format(content, {
      semi: true,
      singleQuote: true,
      parser: "typescript",
    });
  }
}

function genDefinitions(doc) {
  const content = getDefinitionsContent(doc);
  renderDefinitions(content);
}

module.exports = genDefinitions;
