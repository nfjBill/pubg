# react-app-rewire-js-loader

Rewrite and add react loader for js|jsx|mjs

## Installation

```
npm install --save-dev pubg
```

OR

```
yarn add --dev pubg
```

### Example

In your react-app-rewired configuration:

```javascript
/* config-overrides.js */

const rewireJsLoader = require('pubg/react-app-rewire-js-loader');

module.exports = function override(config, env) {
  // ...
  config = rewireJsLoader(config, env);

  return config;
};
```
