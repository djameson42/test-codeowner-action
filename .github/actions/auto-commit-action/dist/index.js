/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = (__nccwpck_require__(147).promises);


const changeTimestamp = async () => {
  const data = await fs.readFile("test-file.txt", "utf8");
  const result = data.replace(/option \(xero\.schema_file_last_modified\) = \d+;/, `option (xero.schema_file_last_modified) = ${Math.floor(Date.now() / 1000)};`);
  await fs.writeFile("test-file.txt", result, "utf8");
};

console.log("starting action");


const getLatestCommit = (url) => {
  return axios.get(url, {
    headers: JSON_ACCEPT_HEADER
  });
}

const getLatestCommitter = async (url) => {
  const data = (await getLatestCommit(url)).data;
  return data.committer.login;
}

(async () => {
  const committer = await getLatestCommitter(`${payload.repository.url}/commits/${payload.pull_request.head.ref}`);

  if (committer != "my-test-bot") {
    changeTimestamp();
  }
})();

})();

module.exports = __webpack_exports__;
/******/ })()
;