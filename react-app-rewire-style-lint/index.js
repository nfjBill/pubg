const StyleLintPlugin = require('stylelint-webpack-plugin');
const config = require('./stylelint-config');

const createRewireStyleLint = function (options = {
  files: 'src/**/*.+(c|sa|sc|le)ss',
  config,
}) {
  return function (config, env) {
    config.plugins.push(new StyleLintPlugin(options));

    return config;
  }
}

const rewireImport = createRewireStyleLint();

rewireImport.withOptions = createRewireStyleLint;

module.exports = rewireImport;
