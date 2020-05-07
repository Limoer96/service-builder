const parser = require("./parser");
const path = require("path");
const findFilePath = require("./util").findFilePath;
function traverse(doc) {
  if (!doc) {
    return;
  }
  if (doc.paths) {
    const keys = Object.keys(doc.paths);
    const templatePath = findFilePath(
      process.cwd(),
      SERVICE_CONFIG.templateClass
    );
    const Renderer = require(templatePath);
    for (let key of keys) {
      const obj = doc.paths[key];
      const result = parser(doc.basePath, key, obj);
      try {
        new Renderer(result).renderContent();
      } catch (error) {
        console.error("请检查渲染模板：", error);
      }
    }
  }
}

module.exports = traverse;
