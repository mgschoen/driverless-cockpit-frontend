'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FSD_API_ROOT: '"http://' + (process.env.HOST || 'localhost') + ':3000/"'
})
