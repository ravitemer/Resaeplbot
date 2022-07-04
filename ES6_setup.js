require = require("esm")(module);
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

requireUncached("./index.js")
// requireUncached('./admin/firebase/_manipulation.js')



