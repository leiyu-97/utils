const path = require('path')

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  extends: path.resolve(__dirname, './.babelrc')
});
