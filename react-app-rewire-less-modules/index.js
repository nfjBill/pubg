const cloneDeep = require("lodash.clonedeep");
const path = require("path");
const fs = require('fs');
const {createLoaderMatcher, findRule, addAfterRule, addBeforeRule, cssRuleMatcher} = require('../utils/rule');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const appSrc = resolveApp('src');
const appNodeModules = resolveApp('node_modules');

const cssLoaderMatcher = createLoaderMatcher('css-loader')
const postcssLoaderMatcher = createLoaderMatcher('postcss-loader')
const fileLoaderMatcher = createLoaderMatcher('file-loader')

const createRewireLess = function (
    lessLoaderOptions = {},
    localIdentName = `[local]__[hash:base64:5]`
) {
    return function(config, env) {
        const cssRule = findRule(config.module.rules, cssRuleMatcher)
        const lessRule = cloneDeep(cssRule)
        const lessModulesRule = cloneDeep(cssRule)

        const add = (rule, include) => {
            rule.test = /\.less$/
            rule.include = include;
            addAfterRule(rule, postcssLoaderMatcher, {loader: require.resolve("less-loader"), options: lessLoaderOptions})
            addBeforeRule(config.module.rules, fileLoaderMatcher, rule)
        }

        add(lessRule, appNodeModules);
        add(lessModulesRule, appSrc);

        const lessModulesRuleCssLoader = findRule(lessModulesRule, cssLoaderMatcher)
        lessModulesRuleCssLoader.options = Object.assign({modules: true, localIdentName}, lessModulesRuleCssLoader.options)

        return config
    }
}

const rewireLess = createRewireLess();

rewireLess.withLoaderOptions = createRewireLess;

module.exports = rewireLess;