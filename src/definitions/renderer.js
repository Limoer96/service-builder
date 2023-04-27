const TypeMap = {
  integer: 'number',
  string: 'string',
  number: 'number',
}

const simpleGenericTypeList = ['integer','string', 'number']

/**
 * 获取数组的类型
 * @param {*} property 
 * @param {*} generic 
 * @returns 
 */
function genArrayType(property, generic) {
  const items = property.items
  const refType =  getRefType(items)
  if(generic && refType === generic) {
    return 'T'
  }
  return items.type ? TypeMap[items.type] : appendNamespacePrefix(refType)
}

/**
 * 获取其它属性的类型
 * @param {*} config 
 * @returns 
 */
function getNormalType(config, generic) {
  const refType = getRefType(config)
  if (generic && refType === generic) {
    return 'T'
  }
  return config.type ? TypeMap[config.type] : appendNamespacePrefix(refType)
}

/**
 * 获取ref引用的类型
 * @param {*} config 
 * @returns 
 */
function getRefType(config) {
    const ref = config.$ref
    // #/definitions/api.GitTokenResponse or #/definitions/ResourceListDTO
    const reg = /#\/definitions\/(\w+.(\w+)|\w+)$/
    const result = reg.exec(ref)
    if (result) {
      return result[2] === '0' ? result[1] : result[2]
    }
}

function appendNamespacePrefix(type) {
  return `defs.${type}`
}

/**
 * 渲染泛型
 * @param {*} key 
 * @param {*} definition 
 * @returns 
 */
exports.genericRenderer = function renderGeneric(key, generic, definition) {
  const properties = definition.properties
  const propKeys = Object.keys(properties)
  const propertiesStrings = propKeys
    .map((key) => {
      if (properties[key].type === 'array') {
        return `
      /** ${properties[key].description || ''}*/
      ${key}?: Array<${genArrayType(properties[key], generic)}>\n
      `
      }
      return `
      /** ${properties[key].description || ''}*/
      ${key}?: ${getNormalType(properties[key], generic)}\n
      `
    })
    .join('')
  return `
    export interface ${key}<T = unknown> {
      ${propertiesStrings}      
    }
  `
}

function isRequired(key, requiredKeys) {
  if (!requiredKeys || requiredKeys.length === 0) {
    return true
  }
  return requiredKeys.includes(key)
}

function getTypeWithGenericType(title) {
  // 一般情况下类似于ApiResult«FileResp»的泛型
  const reg = /(\w+)«(\w+)»$/
  const result = reg.exec(title)
  // 另一种global.Response-api_GitTokenResponse的情况，需要处理类型本身和泛型
  // global.Response-string
  const reg1 = /\w+\.(\w+)-(\w+_(\w+)|\w+)$/
  const result1 = reg1.exec(title)
  // 如果是泛型的情况
  if(result || result1) {
    return {
      type: result ? result[1] : result1[1],
      generic: result ? result[2] : (result1[3] || result1[2])
    }
  }
  // 普通类型
  const normalReg = /\w+\.(\w+)$/
  const normalResult = normalReg.exec(title)
  if (normalResult) {
    return {
      type: normalResult[1],
      generic: null
    }
  }
  return {
    type: title,
    generic: null
  }
}

/**
 * 渲染普通类型
 */
function renderNormal(title, definition) {
  const { properties, required } = definition
  const propKeys = Object.keys(properties)
  const propertiesStrings = propKeys
    .map((key) => {
      const { description, type } = properties[key]
      if (type === 'array') {
        return `
        /** ${description || ''} */
        ${key}${isRequired(key, required) ? '' : '?'}: Array<${genArrayType(
          properties[key]
        )}>
      `
      }
      return `
      /** ${description || ''} */
      ${key}${isRequired(key, required) ? '' : '?'}: ${getNormalType(properties[key])}\n
    `
    })
    .join('')
  return `
    export interface ${title} {
      ${propertiesStrings}
    }
  `
}

exports.renderer =  function index(definition, genericTypes) {
  const title = definition.title
  const { type, generic } = getTypeWithGenericType(title)
  if (generic) {
    // return renderGeneric(type, generic, definition)
    if (genericTypes[type]) {
      // 如果是简单类型就替换
      if(simpleGenericTypeList.includes(genericTypes[type].generic)) {
        genericTypes[type].generic = generic
        genericTypes[type].definition = definition
      }
    } else {
      genericTypes[type] = {
        generic,
        definition
      }
    }
    return ''
  }
  return renderNormal(type, definition)
}

