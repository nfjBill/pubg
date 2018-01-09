const paths = require('../config/paths');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const eslintConfig = require('eslint-config-react-app');

const {
  findRule,
  addBeforeRule,
  fileLoaderMatcher,
} = require('../utils/rule');

module.exports = function (config, env) {
  // config custom eslint rules
  Object.assign(eslintConfig.rules, {
    'no-empty-pattern': 0,
  });

  if (process.env.NODE_ENV === 'production') {
    Object.assign(eslintConfig.rules, {
      'no-console': 1,
    });
  }

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
        baseConfig: eslintConfig,
        ignore: false,
        useEslintrc: false,
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
      babelrc: false,
      presets: [require.resolve('babel-preset-react-app')],
      cacheDirectory: true,
    },
  };

  addBeforeRule(config.module.rules, fileLoaderMatcher, rule)

  return config;
}
