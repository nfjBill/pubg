const paths = require('../config/paths');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const {
  findRule,
  addBeforeRule,
  fileLoaderMatcher,
} = require('../utils/rule');

module.exports = function (config, env) {
  const jsPreLoader = findRule(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.indexOf('source-map-loader') !== -1
  );

  jsPreLoader.test = /\.(js|jsx|mjs)$/;
  jsPreLoader.enforce = 'pre';
  jsPreLoader.loader = undefined;
  jsPreLoader.use = [
    {
      options: {
        formatter: eslintFormatter,
        eslintPath: require.resolve('eslint'),
        // @remove-on-eject-begin
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app')],
        },
        ignore: false,
        useEslintrc: false,
        // @remove-on-eject-end
      },
      loader: require.resolve('eslint-loader'),
    },
  ];
  jsPreLoader.include = paths.appSrc;

  const rule = {
    test: /\.(js|jsx|mjs)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      // @remove-on-eject-begin
      babelrc: false,
      presets: [require.resolve('babel-preset-react-app')],
      // @remove-on-eject-end
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
    },
  };

  addBeforeRule(config.module.rules, fileLoaderMatcher, rule)

  return config;
}
