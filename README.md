## sv-builder

> 一款基于`swagger`文档生成`service`层的工具

### 介绍

`service-builder`支持`swagger`*1.x*和*2.x*版本，使用时仅需要简单配置就可以生成基于路径的`service`，其支持自定义渲染模板，生成的结果是**语言无关**的。

### 使用

1. `npm install sv-builder --save-dev`
2. 在项目根目录新建`.service-config.json`文件，进行配置，一个简单的例子如下：

```json
{
  "originUrl": "http://apidoc.xx.com/gen/v2/api-docs", // 远程swagger文档地址
  "sourcePath": "./service.json", // 本地swagger文档
  "outDir": "./service", // service 输入目录
  "templateClass": "TemplateClass.js", // 模板文件名
  "ext": ".js" // 输出文件扩展名
}
```

3. 在根目录新建模板文件`config.templateClass`指定的同名文件，最基本的写法如下：

```js
const Template = require("sv-builder").Template;

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
```

4. 在文件根目录创建`.js`文件，作为执行入口，

```js
const service = require("sv-builder");

service.run();
```

5. 在`node(版本>=10.0.0)`环境下执行入口文件，`service`将会生成到指定目录。

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
