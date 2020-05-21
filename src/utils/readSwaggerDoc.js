const fs = require('fs')
const isUrl = require('is-url')
const http = require('http')
const { isFileExist, isTypeScript } = require('../util')

/**
 * 从本地读取swagger文档
 * @param {*} path
 */
function readDoc(path) {
  return new Promise((resolve, reject) => {
    if (!isFileExist(path)) {
      reject(`${path} does not exist.`)
    }
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err.message)
      }
      const doc = JSON.parse(data)
      resolve(doc)
    })
  })
}

function readDocOrigin(url) {
  return new Promise((resolve, reject) => {
    if (!isUrl(url)) {
      reject('This is not a valid url.')
    }
    http.get(url, (res) => {
      const { statusCode, statusMessage } = res
      if (statusCode !== 200) {
        res.resume()
        reject(`network error: ${statusMessage}`)
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        const doc = JSON.parse(rawData)
        resolve(doc)
      })
    })
  })
}

module.exports = { readDoc, readDocOrigin }
