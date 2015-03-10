#!/usr/bin/env node
var rc = require('rc')
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var readlineSync = require('readline-sync')
var prompt = readlineSync.question.bind(readlineSync)
var Table = require('cli-table')

var config = {
  syncdir: './db',
  algorithm: 'aes-256-ctr',
  columns: ['Key', 'Description', 'Email']
}

var config = rc('pxx', config)
var filename = 'store.pxx'
var library

function encrypt(unencryptedValue, password) {
  var cipher = crypto.createCipher(config.algorithm, password)
  return [
    cipher.update(unencryptedValue, 'utf8', 'hex'),
    cipher.final('hex')
  ].join('')
}
 
function decrypt(encrypedValue, password) {
  var decipher = crypto.createDecipher(config.algorithm, password)
  return [
    decipher.update(encrypedValue, 'hex', 'utf8'),
    decipher.final('utf8')
  ].join('')
}

function get(password) {

  var key = config._[0]
  var value = library[key]
  console.log(decrypt(value.encryptedValue, password))
}

function put(password) {

  var itemPassword = prompt('Value: ')

  var values = {}

  config.columns.forEach(function(col) {
    values[col] = prompt(col + ': ')
  })

  values.encryptedValue = encrypt(itemPassword, password)

  var key = values[config.columns[0]]
  library[key] = values
  save(password)
}

function ls() {

  var table = new Table({
    head: config.columns
  })

  Object.keys(library).forEach(function(key) {

    var values = []
    for(var k in library[key]) {
      if (k == 'encryptedValue') continue
      values.push(library[key][k])
    }
    table.push(values)
  })

  console.log(table.toString())
}

function save(password) {
  try {
    var encrypted = encrypt(JSON.stringify(library), password)
    fs.writeFileSync(path.join(config.syncdir, filename), encrypted)
  }
  catch(ex) {
    console.error('Could not write (%s).', ex.message)
  }
}

var tries = 0

!function openEncrypted() {

  if (tries++ == 3) return

  var password = prompt('Password: ', { noEchoBack: true })

  try {
    var loc = path.join(config.syncdir, filename)
    var encrypted = fs.readFileSync(loc)
    var decrypted = decrypt(encrypted.toString(), password)
    library = JSON.parse(decrypted)
  }
  catch(ex) {
    if (ex.code == 'ENOENT') {
      library = {}
    }
  }

  if (!library) {
    console.warn('\nSorry, try again.')
    return openEncrypted()
  }

  process.stdout.write('\n')

  if (config.create) {
    put(password)
  }
  else if (config.delete) {
    delete library[config.delete]
    save(password)
  }
  else if (!config._.length) {
    ls()
  }
  else {
    get(password)
  }
}()

