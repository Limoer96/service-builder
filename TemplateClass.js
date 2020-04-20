const Template = require("./src/template");

class MyTemplate extends Template {
  // 必须要实现的方法
  getTemplateContent(doc) {
    return `import request from '@/utils/request'
/**
 * ${doc.summary}
 */
export function ${doc.fileName}(data, params) {
  return request('${doc.url}', '${doc.method}', data, params)
}`;
  }
}

module.exports = MyTemplate;
