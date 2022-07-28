const colors = require('./src/config/colors.json');

module.exports = {
  plugins: {
    // postcss-import allows @import in CSS files.
    // https://github.com/postcss/postcss-import
    'postcss-import': {},

    // postcss-nested supports nested selectors.
    // https://github.com/postcss/postcss-nested
    'postcss-nested': {},

    // https://github.com/madyankin/postcss-modules
    // ['postcss-modules', {
    //   globalModulePaths: [/global.css/]
    // }],

    // postcss-functions allows JS functions inside of CSS files.
    // https://github.com/andyjansson/postcss-functions
    // 'postcss-functions': {
    //   functions: {},
    // },

    // postcss-mixins supports css mixins.
    // https://github.com/postcss/postcss-mixins
    'postcss-mixins': { mixins: {} },

    // postcss-simple-vars allows variables to applied at build time (not to be confused with native CSS variables).
    // https://github.com/postcss/postcss-simple-vars
    'postcss-simple-vars': { variables: colors },

    // postcss-custom-units allows the definition of custom css units.
    // '@mq/volt-toolbox/css/postcss-custom-units': {
    //   units: {
    //     gu: '8px',
    //   },
    // },

    // postcss-property-lookup allows referencing property values within a rule.
    // https://github.com/simonsmith/postcss-property-lookup
    // 'postcss-property-lookup': {},

    // postcss-apply allows the definition and application of reusable rule/property sets. Sets can be defined in css or js.
    // https://github.com/pascalduez/postcss-apply
    // 'postcss-apply': { sets: {} },

    // autoprefixer automatically adds vendor prefixes.
    // autoprefixer: {},
  },
};
