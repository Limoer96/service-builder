const fs = require('fs')
const path = require('path')

function isEmpty(value) {
  return value == undefined || value === ''
}

function isFileExist(path) {
  if (!path) {
    return false
  }
  return fs.existsSync(path)
}

/**
 * 删除数组两端的空元素
 * @param {*} arr
 */
function trimArray(arr) {
  if (!arr || arr.length === 0) {
    return arr
  }
  const len = arr.length
  if (!isEmpty(arr[0]) && !isEmpty(arr[len - 1])) {
    return arr
  }
  let start = 0
  let end = len - 1
  for (; start < end; ) {
    if (isEmpty(arr[start])) {
      start += 1
    } else if (isEmpty(arr[end])) {
      end -= 1
    } else {
      break
    }
  }
  return arr.slice(start, end + 1)
}

function findFilePath(dir, fileName) {
  const files = fs.readdirSync(dir)
  // 这里递归遍历有问题，应该遍历时先检测文件后检测文件夹
  const dirs = []
  for (const file of files) {
    const cName = path.join(dir, file)
    const stats = fs.lstatSync(cName)
    if (stats.isDirectory()) {
      if (file === '.git' || file === 'node_modules') {
        continue
      }
      dirs.push(cName)
    } else if (stats.isFile() && file === fileName) {
      return cName
    }
  }
  for (const dir of dirs) {
    const result = findFilePath(dir, fileName)
    if (result) {
      return result
    }
  }
}

function isTypeScript() {
  const ext = global.SERVICE_CONFIG ? global.SERVICE_CONFIG.ext : ''
  if (!ext) {
    return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.json'))
  }
  return ext === '.ts'
}

exports.findFilePath = findFilePath

exports.trimArray = trimArray

exports.isTypeScript = isTypeScript

exports.isFileExist = isFileExist
