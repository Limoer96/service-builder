const fs = require('fs').promises
const fse = require('fs-extra')
const traverse = require('./src/traverse')
const genDefinitions = require('./src/definitions')
const { isFileExist, isTypeScript, findFilePath } = require('./src/util')
const path = require('path')
const chalk = require('chalk')
const { readDoc, readDocOrigin } = require('./src/utils/readSwaggerDoc')
const checkTemplateExist = require('./src/utils/checkTemplate')

const CONFIG_FILE_NAME = '.service-config.json'

function resolvePath(filename) {
  return path.resolve(process.cwd(), filename)
}

process.on('unhandledRejection', (err) => {
  throw err
})

function run() {
  if (!isFileExist(resolvePath(CONFIG_FILE_NAME))) {
    console.log(
      `config file ${chalk.red(
        CONFIG_FILE_NAME
      )} not exist, add this file first`
    )
    process.exit(1)
  }
  console.log('starting to generate...')
  fs.readFile(findFilePath(process.cwd(), CONFIG_FILE_NAME), 'utf-8')
    .then((file) => {
      const config = JSON.parse(file)
      global.SERVICE_CONFIG = config
      // remove all content in outDir
      fse.emptyDirSync(resolvePath(config.outDir))
      // check template exists.
      const templatePath = resolvePath(config.templateClass)
      return checkTemplateExist(templatePath)
    })
    .then(() => {
      const { originUrl, sourcePath } = global.SERVICE_CONFIG
      if (originUrl) {
        return readDocOrigin(originUrl)
      } else {
        return readDoc(resolvePath(sourcePath))
      }
    })
    .then((doc) => {
      if (isTypeScript()) {
        genDefinitions(doc)
      }
      traverse(doc)
    })
    .catch((err) => {
      console.log(`error happend: ${chalk.red(err)}`)
      process.exit(1)
    })
}

exports.run = run
