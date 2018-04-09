const {cloneDeep} = require("lodash");
const paths = require("../config/paths");
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const _ = require('lodash');

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
    const cssRule = findRule(config.module.rules, cssRuleMatcher);
    const lessRule = cloneDeep(cssRule);
    const lessModulesRule = cloneDeep(cssRule);
    const lessVarObj = {};
    let defaultLess = [];

    if (_.isString(lessLoaderOptions.themePath)) {
      defaultLess.push(lessLoaderOptions.themePath);
    }

    if (_.isArray(lessLoaderOptions.themePath)) {
      defaultLess = _.union(defaultLess, lessLoaderOptions.themePath);
    }

    defaultLess.forEach(path => {
      const themePath = paths.appPath + `/` + path;

      fs.access(themePath, (err) => {
        if (!err) {
          Object.assign(lessVarObj, lessToJs(fs.readFileSync(themePath, 'utf8')))
        } else {
          throw err;
        }
      });
    });

    if (_.isEmpty(lessVarObj)) {
      lessLoaderOptions = Object.assign(
        lessLoaderOptions,
        {modifyVars: lessVarObj},
      )
    }

    const add = (rule, include) => {
      rule.test = /\.less$/;
      rule.include = include;
      addAfterRule(rule, postcssLoaderMatcher, {loader: require.resolve("less-loader"), options: lessLoaderOptions});
      addBeforeRule(config.module.rules, fileLoaderMatcher, rule);
    };

    add(lessRule, paths.appNodeModules);
    add(lessModulesRule, paths.appSrc);

    const lessModulesRuleCssLoader = findRule(lessModulesRule, cssLoaderMatcher);
    lessModulesRuleCssLoader.options = Object.assign({modules: true, localIdentName}, lessModulesRuleCssLoader.options);

    return config;
  }
};

const rewireLess = createRewireLess();

rewireLess.withLoaderOptions = createRewireLess;

module.exports = rewireLess;
