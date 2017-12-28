# react-app-rewire-less-modules

Add [CSS Module](https://github.com/css-modules/css-modules) loaders to your
[create-react-app](https://github.com/facebookincubator/create-react-app) via
[react-app-rewired](https://github.com/timarney/react-app-rewired).

CSS Module styles can be written in CSS or LESS.

## Installation

```
npm install --save-dev pubg
```

OR

```
yarn add --dev pubg
```

## Usage

Use the following file extensions for any CSS Modules styles:

* `*.css`
* `*.less`

### Example

In your react-app-rewired configuration:

```javascript
/* config-overrides.js */

const rewireLess = require("react-app-rewire-less-modules");

module.exports = function override(config, env) {
  // ...
  config = rewireLess(config, env);

  return config;
};
```

In your React application:

```less
// src/App.module.less

.app {
  color: aqua;

  &:hover {
    color: lawngreen;
  }
}
```

```jsx harmony
// src/App.js

import React from 'react';
import styles from './App.module.scss';

export default ({text}) => (
    <div className={styles.app}>{text}</div>
)
```
