/**
 * Created by qiujian on 7/18/17.
 */
require("babel-core/register")({
  "presets": [
    "es2015",
    "stage-0"
  ]
});
require("babel-polyfill");

require('./app.js');