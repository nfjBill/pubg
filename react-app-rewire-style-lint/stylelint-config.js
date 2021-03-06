module.exports = {
  "extends": "stylelint-config-standard",
  "defaultSeverity": "warning",
  "rules": {
    "comment-empty-line-before": null,
    "declaration-empty-line-before": null,
    "function-comma-newline-after": null,
    "function-name-case": null,
    "function-parentheses-newline-inside": null,
    "function-max-empty-lines": null,
    "function-whitespace-after": null,
    "indentation": null,
    "number-leading-zero": null,
    "number-no-trailing-zeros": null,
    "rule-empty-line-before": null,
    "selector-combinator-space-after": null,
    "selector-list-comma-newline-after": null,
    "selector-pseudo-element-colon-notation": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global", "local"]
      }
    ],
    "unit-no-unknown": null,
    "value-list-max-empty-lines": null,
    "font-family-no-missing-generic-family-keyword": null,
    "no-descending-specificity": null
  }
};
