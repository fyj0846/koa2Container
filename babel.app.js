/**
 * Created by qiujian on 7/18/17.
 * 工程入口: node --harmony babel.app.js
 */
require("babel-core/register")({
  "presets": [
    "es2015",
    "stage-0"
  ]
});
require("babel-polyfill");

require('./app.js');