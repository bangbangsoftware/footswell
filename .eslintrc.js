module.exports = {
  env: {
    "browser": true,
    "es6": true,
    "jest/globals": true
  },
  extends: ["eslint:recommended","plugin:jest/recommended"],
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: "module"
  },
  plugins: ["jest"],
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "no-console": 0,
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  }
};
