/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/assets.js":
/*!*******************************!*\
  !*** ./src/scripts/assets.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const baseImagePath = __webpack_require__(/*! ../assets/base-image.png */ "./src/assets/base-image.png");
const assets = {
    "baseImage": {
        name: "baseImage",
        path: baseImagePath,
        x: 0,
        y: 0,
        width: 253,
        height: 575
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assets);


/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _sketch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sketch */ "./src/scripts/sketch.js");

const app = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Application({
    view: document.getElementById("pixi-canvas"),
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 1024,
    height: 768
});
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

const sketch = new _sketch__WEBPACK_IMPORTED_MODULE_1__["default"](app.screen.width, app.screen.height);
app.stage.addChild(sketch);
// bind input
const inputElement = document.getElementById('muscle-name');
inputElement.addEventListener('keypress', (e) => {
    sketch.setCurrentName(inputElement.value);
});
// download service
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
// bind download button
document.getElementById("download").addEventListener("click", (e) => {
    const outData = [];
    sketch.getDrawnObjects().forEach(elem => {
        const data = elem.graphic.geometry.graphicsData;
        outData.push({
            geometry: data[0].points,
            name: elem.name,
        });
    });
    downloadObjectAsJson(outData, "muscles");
    sketch.clearAllDrawnObjects();
});
document.getElementById("reset").addEventListener("click", () => {
    sketch.resetCurrent();
});


/***/ }),

/***/ "./src/scripts/sketch.js":
/*!*******************************!*\
  !*** ./src/scripts/sketch.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sketch)
/* harmony export */ });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets */ "./src/scripts/assets.js");


class Sketch extends pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight) {
        super();
        this.drawnObjects = [];
        this.isDrawing = false;
        this.currentObject = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics();
        this.currentPath = [];
        this.currentName = '';
        // Setting basic context
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        // Load base bitmap
        const baseImageAsset = _assets__WEBPACK_IMPORTED_MODULE_1__["default"].baseImage;
        const baseImage = this.baseImage = pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite.from(_assets__WEBPACK_IMPORTED_MODULE_1__["default"].baseImage.path);
        // Center the base image
        baseImage.anchor.set(0.5, 0.5);
        baseImage.x = screenWidth / 2;
        baseImage.y = screenHeight / 2;
        // Adding base image to the stage
        this.addChild(this.baseImage);
        // binding drawing events
        baseImage.interactive = true;
        baseImage.on('click', this.onClick.bind(this));
        baseImage.on('rightclick', this.onRightClick.bind(this));
        baseImage.addChild(this.currentObject);
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onClick(event) {
        console.log('Left Clicked');
        this.isDrawing = true;
        const pt = event.data.getLocalPosition(event.target);
        console.log(pt);
        const { currentObject, currentPath } = this;
        currentPath.push(pt);
        currentObject.clear();
        currentObject.beginFill(0xff0000);
        currentObject.lineStyle({
            width: 1,
            color: 0x00ff00,
            cap: pixi_js__WEBPACK_IMPORTED_MODULE_0__.LINE_CAP.ROUND,
            join: pixi_js__WEBPACK_IMPORTED_MODULE_0__.LINE_JOIN.ROUND
        });
        currentObject.moveTo(currentPath[0].x, currentPath[0].y);
        for (let i = 1; i < currentPath.length; ++i) {
            currentObject.lineTo(currentPath[i].x, currentPath[i].y);
        }
        currentObject.lineTo(currentPath[0].x, currentPath[0].y);
        currentObject.endFill();
    }
    onRightClick(event) {
        console.log('Right Clicked');
        this.isDrawing = false;
        if (this.currentPath.length < 3) {
            alert('Need more than 3 points');
            return;
        }
        if (!this.currentName.length) {
            alert('You have to name the muscle');
            return;
        }
        this.drawnObjects.push({
            graphic: this.currentObject,
            name: this.currentName
        });
        this.currentObject = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics();
        this.baseImage.addChild(this.currentObject);
        this.currentPath = [];
        document.getElementById('muscle-name').value = '';
        this.currentName = '';
    }
    setCurrentName(name) { this.currentName = name; }
    getDrawnObjects() { return this.drawnObjects; }
    clearAllDrawnObjects() {
        this.drawnObjects.forEach(elem => {
            elem.graphic.destroy();
        });
        this.drawnObjects = [];
        this.currentPath = [];
        this.currentObject.destroy();
        this.currentObject = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics();
    }
    resetCurrent() {
        this.currentObject.destroy();
        this.currentObject = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics();
        this.currentPath = [];
        this.baseImage.addChild(this.currentObject);
    }
}


/***/ }),

/***/ "./src/assets/base-image.png":
/*!***********************************!*\
  !*** ./src/assets/base-image.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "98856d51bbe23ccf5f07.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkkeep_fit"] = self["webpackChunkkeep_fit"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_pixi_js_dist_esm_pixi_js"], () => (__webpack_require__("./src/scripts/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2tlZXAtZml0Ly4vc3JjL3NjcmlwdHMvYXNzZXRzLmpzIiwid2VicGFjazovL2tlZXAtZml0Ly4vc3JjL3NjcmlwdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8va2VlcC1maXQvLi9zcmMvc2NyaXB0cy9za2V0Y2guanMiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYmFzZUltYWdlUGF0aCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9iYXNlLWltYWdlLnBuZycpO1xyXG5jb25zdCBhc3NldHMgPSB7XHJcbiAgICBcImJhc2VJbWFnZVwiOiB7XHJcbiAgICAgICAgbmFtZTogXCJiYXNlSW1hZ2VcIixcclxuICAgICAgICBwYXRoOiBiYXNlSW1hZ2VQYXRoLFxyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICB3aWR0aDogMjUzLFxyXG4gICAgICAgIGhlaWdodDogNTc1XHJcbiAgICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBhc3NldHM7XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAncGl4aS5qcyc7XHJcbmNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbih7XHJcbiAgICB2aWV3OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpeGktY2FudmFzXCIpLFxyXG4gICAgcmVzb2x1dGlvbjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcclxuICAgIGF1dG9EZW5zaXR5OiB0cnVlLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweDY0OTVlZCxcclxuICAgIHdpZHRoOiAxMDI0LFxyXG4gICAgaGVpZ2h0OiA3NjhcclxufSk7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxufSk7XHJcbmltcG9ydCBTa2V0Y2ggZnJvbSAnLi9za2V0Y2gnO1xyXG5jb25zdCBza2V0Y2ggPSBuZXcgU2tldGNoKGFwcC5zY3JlZW4ud2lkdGgsIGFwcC5zY3JlZW4uaGVpZ2h0KTtcclxuYXBwLnN0YWdlLmFkZENoaWxkKHNrZXRjaCk7XHJcbi8vIGJpbmQgaW5wdXRcclxuY29uc3QgaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211c2NsZS1uYW1lJyk7XHJcbmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChlKSA9PiB7XHJcbiAgICBza2V0Y2guc2V0Q3VycmVudE5hbWUoaW5wdXRFbGVtZW50LnZhbHVlKTtcclxufSk7XHJcbi8vIGRvd25sb2FkIHNlcnZpY2VcclxuZnVuY3Rpb24gZG93bmxvYWRPYmplY3RBc0pzb24oZXhwb3J0T2JqLCBleHBvcnROYW1lKSB7XHJcbiAgICB2YXIgZGF0YVN0ciA9IFwiZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGYtOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShleHBvcnRPYmopKTtcclxuICAgIHZhciBkb3dubG9hZEFuY2hvck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBkb3dubG9hZEFuY2hvck5vZGUuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBkYXRhU3RyKTtcclxuICAgIGRvd25sb2FkQW5jaG9yTm9kZS5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCBleHBvcnROYW1lICsgXCIuanNvblwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG93bmxvYWRBbmNob3JOb2RlKTsgLy8gcmVxdWlyZWQgZm9yIGZpcmVmb3hcclxuICAgIGRvd25sb2FkQW5jaG9yTm9kZS5jbGljaygpO1xyXG4gICAgZG93bmxvYWRBbmNob3JOb2RlLnJlbW92ZSgpO1xyXG59XHJcbi8vIGJpbmQgZG93bmxvYWQgYnV0dG9uXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG93bmxvYWRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICBjb25zdCBvdXREYXRhID0gW107XHJcbiAgICBza2V0Y2guZ2V0RHJhd25PYmplY3RzKCkuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZWxlbS5ncmFwaGljLmdlb21ldHJ5LmdyYXBoaWNzRGF0YTtcclxuICAgICAgICBvdXREYXRhLnB1c2goe1xyXG4gICAgICAgICAgICBnZW9tZXRyeTogZGF0YVswXS5wb2ludHMsXHJcbiAgICAgICAgICAgIG5hbWU6IGVsZW0ubmFtZSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZG93bmxvYWRPYmplY3RBc0pzb24ob3V0RGF0YSwgXCJtdXNjbGVzXCIpO1xyXG4gICAgc2tldGNoLmNsZWFyQWxsRHJhd25PYmplY3RzKCk7XHJcbn0pO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBza2V0Y2gucmVzZXRDdXJyZW50KCk7XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBDb250YWluZXIsIFNwcml0ZSwgR3JhcGhpY3MsIExJTkVfQ0FQLCBMSU5FX0pPSU4gfSBmcm9tIFwicGl4aS5qc1wiO1xyXG5pbXBvcnQgYXNzZXRzIGZyb20gJy4vYXNzZXRzJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2tldGNoIGV4dGVuZHMgQ29udGFpbmVyIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gICAgICBMaWZlQ3ljbGVcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3bk9iamVjdHMgPSBbXTtcclxuICAgICAgICB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdCA9IG5ldyBHcmFwaGljcygpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBbXTtcclxuICAgICAgICB0aGlzLmN1cnJlbnROYW1lID0gJyc7XHJcbiAgICAgICAgLy8gU2V0dGluZyBiYXNpYyBjb250ZXh0XHJcbiAgICAgICAgdGhpcy5zY3JlZW5XaWR0aCA9IHNjcmVlbldpZHRoO1xyXG4gICAgICAgIHRoaXMuc2NyZWVuSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0O1xyXG4gICAgICAgIC8vIExvYWQgYmFzZSBiaXRtYXBcclxuICAgICAgICBjb25zdCBiYXNlSW1hZ2VBc3NldCA9IGFzc2V0cy5iYXNlSW1hZ2U7XHJcbiAgICAgICAgY29uc3QgYmFzZUltYWdlID0gdGhpcy5iYXNlSW1hZ2UgPSBTcHJpdGUuZnJvbShhc3NldHMuYmFzZUltYWdlLnBhdGgpO1xyXG4gICAgICAgIC8vIENlbnRlciB0aGUgYmFzZSBpbWFnZVxyXG4gICAgICAgIGJhc2VJbWFnZS5hbmNob3Iuc2V0KDAuNSwgMC41KTtcclxuICAgICAgICBiYXNlSW1hZ2UueCA9IHNjcmVlbldpZHRoIC8gMjtcclxuICAgICAgICBiYXNlSW1hZ2UueSA9IHNjcmVlbkhlaWdodCAvIDI7XHJcbiAgICAgICAgLy8gQWRkaW5nIGJhc2UgaW1hZ2UgdG8gdGhlIHN0YWdlXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmJhc2VJbWFnZSk7XHJcbiAgICAgICAgLy8gYmluZGluZyBkcmF3aW5nIGV2ZW50c1xyXG4gICAgICAgIGJhc2VJbWFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgYmFzZUltYWdlLm9uKCdjbGljaycsIHRoaXMub25DbGljay5iaW5kKHRoaXMpKTtcclxuICAgICAgICBiYXNlSW1hZ2Uub24oJ3JpZ2h0Y2xpY2snLCB0aGlzLm9uUmlnaHRDbGljay5iaW5kKHRoaXMpKTtcclxuICAgICAgICBiYXNlSW1hZ2UuYWRkQ2hpbGQodGhpcy5jdXJyZW50T2JqZWN0KTtcclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gICAgICBFdmVudCBIYW5kbGVyc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBvbkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xlZnQgQ2xpY2tlZCcpO1xyXG4gICAgICAgIHRoaXMuaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwdCA9IGV2ZW50LmRhdGEuZ2V0TG9jYWxQb3NpdGlvbihldmVudC50YXJnZXQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHB0KTtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRPYmplY3QsIGN1cnJlbnRQYXRoIH0gPSB0aGlzO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLnB1c2gocHQpO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuY2xlYXIoKTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmJlZ2luRmlsbCgweGZmMDAwMCk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5saW5lU3R5bGUoe1xyXG4gICAgICAgICAgICB3aWR0aDogMSxcclxuICAgICAgICAgICAgY29sb3I6IDB4MDBmZjAwLFxyXG4gICAgICAgICAgICBjYXA6IExJTkVfQ0FQLlJPVU5ELFxyXG4gICAgICAgICAgICBqb2luOiBMSU5FX0pPSU4uUk9VTkRcclxuICAgICAgICB9KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0Lm1vdmVUbyhjdXJyZW50UGF0aFswXS54LCBjdXJyZW50UGF0aFswXS55KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN1cnJlbnRQYXRoLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRPYmplY3QubGluZVRvKGN1cnJlbnRQYXRoW2ldLngsIGN1cnJlbnRQYXRoW2ldLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50T2JqZWN0LmxpbmVUbyhjdXJyZW50UGF0aFswXS54LCBjdXJyZW50UGF0aFswXS55KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmVuZEZpbGwoKTtcclxuICAgIH1cclxuICAgIG9uUmlnaHRDbGljayhldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdSaWdodCBDbGlja2VkJyk7XHJcbiAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdOZWVkIG1vcmUgdGhhbiAzIHBvaW50cycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50TmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ1lvdSBoYXZlIHRvIG5hbWUgdGhlIG11c2NsZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd25PYmplY3RzLnB1c2goe1xyXG4gICAgICAgICAgICBncmFwaGljOiB0aGlzLmN1cnJlbnRPYmplY3QsXHJcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuY3VycmVudE5hbWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLmJhc2VJbWFnZS5hZGRDaGlsZCh0aGlzLmN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBbXTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzY2xlLW5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5hbWUgPSAnJztcclxuICAgIH1cclxuICAgIHNldEN1cnJlbnROYW1lKG5hbWUpIHsgdGhpcy5jdXJyZW50TmFtZSA9IG5hbWU7IH1cclxuICAgIGdldERyYXduT2JqZWN0cygpIHsgcmV0dXJuIHRoaXMuZHJhd25PYmplY3RzOyB9XHJcbiAgICBjbGVhckFsbERyYXduT2JqZWN0cygpIHtcclxuICAgICAgICB0aGlzLmRyYXduT2JqZWN0cy5mb3JFYWNoKGVsZW0gPT4ge1xyXG4gICAgICAgICAgICBlbGVtLmdyYXBoaWMuZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZHJhd25PYmplY3RzID0gW107XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdC5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbmV3IEdyYXBoaWNzKCk7XHJcbiAgICB9XHJcbiAgICByZXNldEN1cnJlbnQoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gW107XHJcbiAgICAgICAgdGhpcy5iYXNlSW1hZ2UuYWRkQ2hpbGQodGhpcy5jdXJyZW50T2JqZWN0KTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJpbmRleFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5ra2VlcF9maXRcIl0gPSBzZWxmW1wid2VicGFja0NodW5ra2VlcF9maXRcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3BpeGlfanNfZGlzdF9lc21fcGl4aV9qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9zY3JpcHRzL2luZGV4LmpzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=