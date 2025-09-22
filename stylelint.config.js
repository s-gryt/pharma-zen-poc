/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss'
  ],
  rules: {
    // Enforce consistent naming conventions
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case'
      }
    ],
    
    // Color and design system enforcement
    'color-no-hex': true,
    'color-named': 'never',
    'declaration-property-value-disallowed-list': {
      '/^color$/': ['/^#/', '/^rgb/', '/^rgba/', '/^hsl/', '/^hsla/'],
      '/^background-color$/': ['/^#/', '/^rgb/', '/^rgba/', '/^hsl/', '/^hsla/'],
      '/^border-color$/': ['/^#/', '/^rgb/', '/^rgba/', '/^hsl/', '/^hsla/']
    },
    
    // Enforce design tokens usage
    'custom-property-pattern': [
      '^[a-z]([a-z0-9-]+)?$',
      {
        message: 'Expected custom property name to be kebab-case'
      }
    ],
    
    // CSS best practices
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true,
    'no-irregular-whitespace': true,
    
    // Specificity control
    'selector-max-specificity': '0,3,0',
    'selector-max-id': 0,
    'selector-max-universal': 1,
    'selector-max-type': 2,
    'selector-max-class': 3,
    'selector-max-attribute': 2,
    'selector-max-pseudo-class': 3,
    
    // Performance optimizations
    'no-unknown-animations': true,
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': true,
    
    // Accessibility
    'color-contrast': null, // Handled by design system
    'font-weight-notation': 'numeric',
    
    // Property ordering
    'order/properties-alphabetical-order': null, // Allow flexibility
    
    // Disallow problematic features
    'font-family-no-missing-generic-family-keyword': true,
    'media-feature-name-no-unknown': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'unit-no-unknown': true,
    
    // Enforce consistent formatting
    'indentation': 2,
    'max-empty-lines': 2,
    'max-line-length': 120,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'no-extra-semicolons': true,
    
    // String formatting
    'string-quotes': 'single',
    'string-no-newline': true,
    
    // Number formatting
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    
    // URL formatting
    'url-quotes': 'always',
    'url-no-scheme-relative': true,
    
    // Function formatting
    'function-comma-space-after': 'always',
    'function-comma-space-before': 'never',
    'function-max-empty-lines': 0,
    'function-name-case': 'lower',
    'function-parentheses-space-inside': 'never',
    'function-url-scheme-allowed-list': ['https', 'http', 'data'],
    'function-whitespace-after': 'always',
    
    // Value formatting
    'value-keyword-case': 'lower',
    'value-list-comma-space-after': 'always',
    'value-list-comma-space-before': 'never',
    'value-list-max-empty-lines': 0,
    
    // Declaration formatting
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'declaration-empty-line-before': null,
    
    // Block formatting
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    
    // Selector formatting
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    'selector-descendant-combinator-no-non-space': true,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    
    // Rule formatting
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment']
      }
    ],
    
    // Media query formatting
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'media-query-list-comma-space-after': 'always',
    'media-query-list-comma-space-before': 'never',
    
    // At-rule formatting
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment']
      }
    ],
    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always',
    'at-rule-semicolon-newline-after': 'always',
    'at-rule-semicolon-space-before': 'never',
    
    // Comment formatting
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands']
      }
    ],
    'comment-whitespace-inside': 'always',
    
    // Tailwind CSS specific
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer'
        ]
      }
    ],
    
    // Allow Tailwind utilities
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen']
      }
    ]
  },
  
  ignoreFiles: [
    'dist/**/*',
    'build/**/*',
    'node_modules/**/*',
    'coverage/**/*',
    '**/*.js',
    '**/*.ts',
    '**/*.tsx'
  ],
  
  overrides: [
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss'
    }
  ]
};