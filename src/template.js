const path = require("path");
const util = require("./util");
const mkdirp = require("mkdirp");

class Template {
  constructor(docs) {
    this.docs = docs;
    const config = global.SERVICE_CONFIG || {};
    this.rootDir = path.join(process.cwd(), config.outDir);
    console.log(this.rootDir);
    this.ext = config.ext; // 扩展名
  }
  renderContent() {
    const multiMethod = this.docs && this.docs.length > 1;
    for (let doc of this.docs) {
      const { fileName, dirName, method } = doc;
      const relativePath = path.join(this.rootDir, dirName);
      const fName = multiMethod
        ? `${fileName}${method}${this.ext}`
        : `${fileName}${this.ext}`;
      const filePath = path.join(relativePath, fName);
      let content = this.getTemplateContent(doc);
      mkdirp(relativePath).then(() => {
        util.writeFile(filePath, content);
      });
    }
  }
  getTemplateContent(doc) {
    console.warn("使用预定义的`getTemplateContent`将无法输出结果");
    return "";
  }
}

module.exports = Template;
