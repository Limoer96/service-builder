const path = require("path");
const util = require("./util");
const mkdirp = require("mkdirp");
const appRoot = require("app-root-path").toString();

class Template {
  constructor(docs) {
    this.docs = docs;
    const config = global.SERVICE_CONFIG || {};
    this.rootDir = path.join(appRoot, config.outDir);
  }
  renderContent() {
    const multiMethod = this.docs && this.docs.length > 1;
    for (let doc of this.docs) {
      const { fileName, dirName, method } = doc;
      const relativePath = path.join(this.rootDir, dirName);
      const fName = multiMethod ? `${fileName}${method}.js` : `${fileName}.js`;
      const filePath = path.join(relativePath, fName);
      let content = this.getTemplateContent(doc);
      mkdirp(relativePath).then(() => {
        util.writeFile(filePath, content);
      });
    }
  }
  getTemplateContent(doc) {
    return "";
  }
}

module.exports = Template;
