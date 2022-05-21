// import { boot } from 'quasar/wrappers'
const wrap = require('quasar/wrappers');
const VueGtag = require("vue-gtag");
const YalubaGtag = require("../secrets/gtag.js");

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
module.exports = wrap.boot(async ( { app } ) => {
  app.use(VueGtag, {
    config: {
      id: YalubaGtag.yaluba_gtag
    }
  })
})
