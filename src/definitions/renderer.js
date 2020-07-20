const TypeMap = {
  integer: 'number',
  string: 'string',
  number: 'number',
}

function renderGeneric(key, definition) {
  const properties = definition.properties
  const propKeys = Object.keys(properties)
  const propertiesStrings = propKeys
    .map((key) => {
      if (key === 'results' && properties[key].type === 'array') {
        return `
      /** ${properties[key].description}*/
      ${key}?: Array<T>\n
      `
      }
      return `
      /** ${properties[key].description}*/
      ${key}?: ${TypeMap[properties[key].type]}\n
      `
    })
    .join('')
  return `
    export interface ${key}<T = any> {
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
// 获取泛型
function getGeneric(items) {
  return items.type || `defs.${items.originalRef}`
}

function renderNormal(definition) {
  const { properties, title, required } = definition
  const propKeys = Object.keys(properties)
  const propertiesStrings = propKeys
    .map((key) => {
      const { description, type, items } = properties[key]
      if (type === 'array') {
        return `
        /** ${description} */
        ${key}${isRequired(key, required) ? '' : '?'}: Array<${getGeneric(
          items
        )}>
      `
      }
      return `
      /** ${description} */
      ${key}${isRequired(key, required) ? '' : '?'}: ${TypeMap[type]}\n
    `
    })
    .join('')
  return `
    export interface ${title} {
      ${propertiesStrings}
    }
  `
}

function index(definition, typeDefinitions) {
  const title = definition.title
  const reg = /(\w+)«\w+»$/
  const result = reg.exec(title)
  const definitionName = result ? result[1] : title
  if (typeDefinitions.includes(definitionName)) {
    return ''
  }
  typeDefinitions.push(definitionName)
  if (result) {
    return renderGeneric(result[1], definition)
  }
  return renderNormal(definition)
}

module.exports = index
