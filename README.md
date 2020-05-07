## sv-builder

> 一款基于`swagger`文档生成`service`层的工具

### 介绍

`service-builder`支持`swagger`*1.x*和*2.x*版本，使用时仅需要简单配置就可以生成基于路径的`service`，其支持自定义渲染模板，生成的结果是**语言无关**的。

### 使用

#### 基本方式

1. `npm install sv-builder sv-builder-template --save-dev`
2. 在项目根目录新建`.service-config.json`文件，进行配置，一个简单的例子如下：

```json
{
  "originUrl": "http://apidoc.xx.com/gen/v2/api-docs", // 远程swagger文档地址
  "sourcePath": "./service.json", // 本地swagger文档
  "outDir": "./service", // service 输入目录
  "templateClass": "TemplateClass.js", // 模板文件名
  "ext": ".ts" // 输出文件扩展名
}
```

3. 在根目录新建模板文件`config.templateClass`指定的同名文件，一个简易的写法可以是：

```js
const Template = require("sv-builder").Template;

class MyTemplate extends Template {
  // 必须要实现的方法
  getTemplateContent(doc) {
    const [queryParams, bodyParams] = this.getTypeParams();
    return `
      import request from '@/utils/request'

      type BodyParams = ${bodyParams}
      interface QueryParams {
        ${this.getTypeQueryParams(queryParams)}
      }
      /**
       * ${doc.summary}
       */
      export function ${doc.fileName}(query: QueryParams, body: BodyParams) {
        return request('${doc.url}', '${doc.method}', query, body)
      }
    `;
  }
}

module.exports = MyTemplate;
```

4. 在文件根目录创建`.js`文件，作为执行入口，

```js
const service = require("sv-builder");

service.run();
```

5. 在`node(版本>=10.0.0)`环境下执行入口文件，`service`(如果是 ts 的话还将生成相关的类型定义文件`api.d.ts`)将会生成到指定目录。

#### CLI（>=1.2.0 版本）

<span id="usage-cli"></span>

1. `npm install -g sv-builder` 安装到全局
2. `npm install sv-builder-template --save-dev` 安装模板文件
3. 运行`sv-builder -i`或者`sv-builder init` 初始化，将生成`.service-config.json`和`Template.js`两个文件
4. 按需修改`.service-config.json`和`Template.js`
5. 运行`sv-builder -g`或`sv-builder generate`生成`service`

### Tips

- 在`originUrl`和`sourcePath`同时配置的情况下，优先使用远程`swagger`文档。
- 自定义模板类一定要继承`Template`类和实现`getTemplateContent`方法，否则无法生成
- `getTemplateContent(doc)`中参数`doc`类型如下：

```ts
interface IDoc {
  summary: string; // 接口摘要/注释
  method: string; // 请求method类型
  fileName: string; // 文件名
  dirName: string; // 存放目录
  url: string; // 请求地址
  params: parameters[]; // 请求参数 见swagger文档 parameters
  doc: any; // 某一请求的原始swagger文档
}
```

### 更新记录

#### 1.1.0

- 增加对`ts`的支持，现在可以生成相关的`.d.ts`文件，`Template`类提供了`getTypeParams`和`getTypeQueryParams`的方法用于生成参数定义

#### 1.2.0

- 新增`CLI`，用法见[使用/CLI](#usage-cli)
