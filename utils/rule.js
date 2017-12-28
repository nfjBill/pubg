const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || []

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource)
    rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher))
    return result
}

const findRule = (rulesSource, ruleMatcher) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    return rules[index]
}

const cssRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.css$/)

const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`/${loader}/`) !== -1
// const cssLoaderMatcher = createLoaderMatcher('css-loader')
// const postcssLoaderMatcher = createLoaderMatcher('postcss-loader')
// const fileLoaderMatcher = createLoaderMatcher('file-loader')

const addAfterRule = (rulesSource, ruleMatcher, value) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    rules.splice(index + 1, 0, value)
}

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    rules.splice(index, 0, value)
}

module.exports = {
    findRule,
    cssRuleMatcher,
    createLoaderMatcher,
    addAfterRule,
    addBeforeRule,
}