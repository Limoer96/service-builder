// const Template = require("sv-builder").Template;

// class TemplateClass extends Template {
//   // 必须要实现的方法
//   getTemplateContent(doc) {
//     const [queryParams, bodyParams] = this.getTypeParams();
//     return `
//       import request from '@/utils/request'

//       type BodyParams = ${bodyParams}
//       interface QueryParams {
//         ${this.getTypeQueryParams(queryParams)}
//       }
//       /**
//        * ${doc.summary}
//        */
//       export function ${doc.fileName}(query: QueryParams, body: BodyParams) {
//         return request('${doc.url}', '${doc.method}', query, body)
//       }
//     `;
//   }
// }

// module.exports = TemplateClass;
