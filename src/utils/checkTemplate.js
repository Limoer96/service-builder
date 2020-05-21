const fs = require('fs-extra')
const path = require('path')

const TEMPLATE_PKG_NAME = 'sv-builder-template'

function checkTemplateExist(file) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      reject('template file not exist. please add before generate.')
    }
    const nodeModulePath = path.resolve(process.cwd(), 'node_modules')
    fs.readdir(nodeModulePath, (err, files) => {
      if (err) {
        reject(err.message)
      }
      for (file of files) {
        if (file === TEMPLATE_PKG_NAME) {
          resolve(true)
        }
      }
      reject(
        `you did not install *sv-builder-template*, run 'yarn add sv-builder-template' before generate.`
      )
    })
  })
}

module.exports = checkTemplateExist
