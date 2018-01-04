const tsImportPluginFactory = require('ts-import-plugin')
const {getLoader} = require("react-app-rewired");

const createRewireImport = function (
  options = {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }
) {
  return function (config, env) {
    const tsLoader = getLoader(
      config.module.rules,
      rule =>
        rule.loader &&
        typeof rule.loader === 'string' &&
        rule.loader.includes('ts-loader')
    );

    tsLoader.options = {
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory(options)]
      })
    };

    return config;
  }
}

const rewireImport = createRewireImport();

rewireImport.withLoaderOptions = createRewireImport;

module.exports = rewireImport;