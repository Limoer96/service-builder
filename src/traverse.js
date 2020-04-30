const parser = require("./parser");
const path = require("path");
const findFilePath = require("./util").findFilePath;
const Template = require("./template");
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
    if (Object.getPrototypeOf(Renderer) !== Template) {
      console.error("渲染模板必须继承预定模板<Template>");
      return;
    }
    for (let key of keys) {
      const obj = doc.paths[key];
      const result = parser(doc.basePath, key, obj);
      new Renderer(result).renderContent();
    }
  }
}

module.exports = traverse;
