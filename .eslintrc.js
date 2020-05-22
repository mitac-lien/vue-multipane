module.exports = {
    root: true,
    env: {
        es6: true,
        browser: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
        sourceType: 'module',
    },
    extends: "eslint:recommended"
};
