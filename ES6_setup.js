require = require("esm")(module);
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
//const generateFunctions = requireUncached("./generate.js").default
requireUncached("./index.js")



