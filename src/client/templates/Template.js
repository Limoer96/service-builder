// eslint-disable-next-line @typescript-eslint/no-require-imports
const Template = require('sv-builder-template')

class TemplateClass extends Template {
  // 必须要实现的方法
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/explicit-member-accessibility
  getTemplateContent(doc) {
    const { queryParams, bodyParams, pathParams } = this.getTypeParams()
    const usedParams = ['query']
    if (bodyParams) {
      usedParams.push('body')
    }
    if (pathParams && pathParams.length) {
      usedParams.push('path')
    }
    const usedParamsStr = `{${usedParams.join(', ')}}`
    return `
      import request from '@/utils/request'
      import { stringify } from 'qs'
      type BodyParams = ${bodyParams || 'unknown'}
      
      interface QueryParams {
        ${this.getTypeQueryParams(queryParams)}
      }
      interface PathParams {
        ${this.getTypeQueryParams(pathParams)}
      }
      interface IParams {
        query: QueryParams
        body: BodyParams
        path: PathParams
      }
      /**
       * ${doc.summary}
       */
      export function ${doc.fileName}(${usedParamsStr}: IParams) {
        return request<${this.getResponseType()}>({
          url: \`${this.getUrl()}?\${stringify(query||{}, {arrayFormat: 'repeat'})}\`,
          method: '${doc.method}',
          ${bodyParams ? 'body' : ''}
        })
      }
    `
  }
}

module.exports = TemplateClass
