const parser = require("./parser");
const path = require("path");
const appPath = require("app-root-path").toString();
function traverse(doc) {
  if (!doc) {
    return;
  }
  if (doc.paths) {
    const keys = Object.keys(doc.paths);
    const templatePath = path.join(
      appPath,
      global.SERVICE_CONFIG.templateClass
    );
    const Renderer = require(templatePath);
    for (let key of keys) {
      const obj = doc.paths[key];
      const result = parser(doc.basePath, key, obj);
      new Renderer(result).renderContent();
    }
  }
}

module.exports = traverse;
