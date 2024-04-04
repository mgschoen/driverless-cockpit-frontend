'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FSD_API_ROOT: `"${process.env.API_HOST || 'http://localhost:3000/'}"`,
})
