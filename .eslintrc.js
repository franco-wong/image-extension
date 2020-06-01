module.exports = {
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  parserOptions: {
    ecmaVersion: 2018, // ES9
    sourceType: 'module',
    impliedStrict: true,
  },
  env: {
    browser: true,
    webextensions: true,
  },
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
  },
}
