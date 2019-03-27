const p = require('bluebird')
const fs = (require('fs'))
const { resolve, dirname, join } = require('path')
const { map, last } = require('lodash')
const { spawn } = require('child_process')

const exists = (file) => new p((resolve, reject) => fs.access(file, (err,data) => err ? reject(err) : resolve(file)))
const readFile = (file) => new p((resolve, reject) => fs.readFile(file, (err,data) => err ? reject(err) : resolve(data)))

function * match(regex, data) {
  var result 
  while (result = regex.exec(data)) {
    yield result.groups
  }
}

const extractDot = (data) => 
   match(new RegExp(/```dot\s(?<fileName>.*\....)\n(?<code>[\s\S]*?)\n```/g), data)

const load = (fileName) =>
   exists(fileName).then(readFile).then((buffer) => buffer.toString('utf8'))

const callDot = (dir) => ({fileName, code}) => new p((resolve, reject) => {
  const child = spawn('/usr/bin/dot', ['-Tsvg'])
  const [ stdin, stdout, stderr ] = child.stdio
  const fileStream = fs.createWriteStream(join(dir, fileName))
  stdout.pipe(fileStream)
  stdout.on('end', () => resolve(fileName))

  stdin.write(code)
  stdin.end()
})
  
const renderDot = (fileName) => 
  load(fileName)
      .then(extractDot)
      .then((matches) => p.map(matches, callDot(dirname(fileName))))

renderDot(resolve(last(process.argv))).then((data) => console.log(data))

