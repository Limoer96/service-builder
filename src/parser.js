const utils = require('./util')
const { reservedWords } = require('./constants')
/**
 * 生成路径名
 * @param {*} pathArr 路径
 */
function getDirName(pathArr) {
  return pathArr
    .map((path, index) => {
      if (index === 0) {
        return path
      }
      return path.charAt(0).toUpperCase() + path.slice(1)
    })
    .join('')
}

function parser(basePath, path, reqs) {
  let pathArr = path.replace(basePath, '').split('/')
  pathArr = utils.trimArray(pathArr)
  let fileName = pathArr.pop().replace(/[{}]/g, '')
  // 处理关键字和保留字
  if (reservedWords.includes(fileName)) {
    fileName += '_'
  }
  const dirName = getDirName(pathArr)
  const keys = Object.keys(reqs)
  return keys.map((key) => {
    const req = reqs[key]
    return {
      summary: req.summary,
      method: key,
      fileName,
      dirName,
      url: path.replace(basePath, ''),
      params: req.parameters,
      doc: req,
    }
  })
}

module.exports = parser
