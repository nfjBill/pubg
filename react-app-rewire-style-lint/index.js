const StyleLintPlugin = require('stylelint-webpack-plugin');

const createRewireStyleLint = function (options = {files: '**/*.+(c|sa|sc|le)ss'}) {
  return function (config, env) {
    config.plugins.push(new StyleLintPlugin(options));

    return config;
  }
}

const rewireImport = createRewireStyleLint();

rewireImport.withOptions = createRewireStyleLint;

module.exports = rewireImport;