/* eslint-env node */
// See https://github.com/okonet/lint-staged#configuration
module.exports = {
  '*.js': ['standard --cache --fix', 'prettier --parser=babel --write'],
  '*.css': ['stylelint --fix', 'prettier --parser=css --write'],
  '*.{md,mdx}': [
    // 'eslint --cache --fix',
    'prettier --parser=mdx --write',
  ],
  // '*.html': 'prettier --parser=html --write',
  '*.json': 'prettier --parser=json --write',
  '*.{yaml,yml}': 'prettier --parser=yaml --write',
};
