import path from 'path'
import fs from 'fs'

import express from 'express'
import morgan from 'morgan'
import formidable from 'formidable'

const server = express()

server.use(morgan('tiny'))

server.use(express.static(path.join(__dirname, 'uploads')))

server.get('/', (req, res) => {
  let html = '<!DOCTYPE html><html><head></head><body><h2>/uploads</h2><ul>'
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    files.forEach(file => {
      html += `<li><a href="${file}">${file}</li>`
      console.log(file)
    })
    html += '<ul></body></html>'
    res.send(html)
  })
})

server.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm()
  form.multiples = true
  form.uploadDir = path.join(__dirname, 'uploads')
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name))
  })
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err)
  })
  form.on('end', function() {
    res.end('success')
  })
  form.parse(req)
})

server.listen(3000, () => {
  console.log('server listen on port 3000')
})