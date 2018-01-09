const {cloneDeep} = require("lodash");
const paths = require("../config/paths");
const fs = require('fs');
const lessToJs = require('less-vars-to-js')

const {
  findRule,
  addAfterRule,
  addBeforeRule,
  cssRuleMatcher,
  cssLoaderMatcher,
  postcssLoaderMatcher,
  fileLoaderMatcher,
} = require('../utils/rule');

const createRewireLess = function (lessLoaderOptions = {},
                                   localIdentName = `[local]__[hash:base64:5]`) {
  return function (config, env) {
    const cssRule = findRule(config.module.rules, cssRuleMatcher)
    const lessRule = cloneDeep(cssRule)
    const lessModulesRule = cloneDeep(cssRule)

    if (lessLoaderOptions.themePath) {
      const themePath = paths.appPath + `/` + lessLoaderOptions.themePath;

      fs.access(themePath, (err) => {
        if (!err) {
          lessLoaderOptions = Object.assign(
            lessLoaderOptions,
            {modifyVars: lessToJs(fs.readFileSync(themePath, 'utf8'))},
          )
        } else {
          throw err;
        }
      });
    }

    const add = (rule, include) => {
      rule.test = /\.less$/
      rule.include = include;
      addAfterRule(rule, postcssLoaderMatcher, {loader: require.resolve("less-loader"), options: lessLoaderOptions})
      addBeforeRule(config.module.rules, fileLoaderMatcher, rule)
    }

    add(lessRule, paths.appNodeModules);
    add(lessModulesRule, paths.appSrc);

    const lessModulesRuleCssLoader = findRule(lessModulesRule, cssLoaderMatcher)
    lessModulesRuleCssLoader.options = Object.assign({modules: true, localIdentName}, lessModulesRuleCssLoader.options)

    return config
  }
}

const rewireLess = createRewireLess();

rewireLess.withLoaderOptions = createRewireLess;

module.exports = rewireLess;
