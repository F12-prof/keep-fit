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
        const points = elem.graphic.geometry.graphicsData[0].points;
        // getting bouding rect's center of the graphic
        const boundRect = elem.graphic.getLocalBounds();
        const cx = (boundRect.left + boundRect.right) / 2;
        const cy = (boundRect.top + boundRect.bottom) / 2;
        // converting the points to local coordinates
        for (let i = 0; i < points.length; i += 2) {
            points[i] -= cx;
            points[i + 1] -= cy;
        }
        outData.push({
            geometry: points,
            name: elem.name,
            x: cx,
            y: cy
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
        this.baseImage.addChild(this.currentObject);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDZkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2VlcC1maXQvLi9zcmMvc2NyaXB0cy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8va2VlcC1maXQvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9rZWVwLWZpdC8uL3NyYy9zY3JpcHRzL3NrZXRjaC5qcyIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBiYXNlSW1hZ2VQYXRoID0gcmVxdWlyZSgnLi4vYXNzZXRzL2Jhc2UtaW1hZ2UucG5nJyk7XHJcbmNvbnN0IGFzc2V0cyA9IHtcclxuICAgIFwiYmFzZUltYWdlXCI6IHtcclxuICAgICAgICBuYW1lOiBcImJhc2VJbWFnZVwiLFxyXG4gICAgICAgIHBhdGg6IGJhc2VJbWFnZVBhdGgsXHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwLFxyXG4gICAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgYXNzZXRzO1xyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ3BpeGkuanMnO1xyXG5jb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oe1xyXG4gICAgdmlldzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaXhpLWNhbnZhc1wiKSxcclxuICAgIHJlc29sdXRpb246IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXHJcbiAgICBhdXRvRGVuc2l0eTogdHJ1ZSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogMHg2NDk1ZWQsXHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNzY4XHJcbn0pO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbn0pO1xyXG5pbXBvcnQgU2tldGNoIGZyb20gJy4vc2tldGNoJztcclxuY29uc3Qgc2tldGNoID0gbmV3IFNrZXRjaChhcHAuc2NyZWVuLndpZHRoLCBhcHAuc2NyZWVuLmhlaWdodCk7XHJcbmFwcC5zdGFnZS5hZGRDaGlsZChza2V0Y2gpO1xyXG4vLyBiaW5kIGlucHV0XHJcbmNvbnN0IGlucHV0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNjbGUtbmFtZScpO1xyXG5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCAoZSkgPT4ge1xyXG4gICAgc2tldGNoLnNldEN1cnJlbnROYW1lKGlucHV0RWxlbWVudC52YWx1ZSk7XHJcbn0pO1xyXG4vLyBkb3dubG9hZCBzZXJ2aWNlXHJcbmZ1bmN0aW9uIGRvd25sb2FkT2JqZWN0QXNKc29uKGV4cG9ydE9iaiwgZXhwb3J0TmFtZSkge1xyXG4gICAgdmFyIGRhdGFTdHIgPSBcImRhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmLTgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoZXhwb3J0T2JqKSk7XHJcbiAgICB2YXIgZG93bmxvYWRBbmNob3JOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgZG93bmxvYWRBbmNob3JOb2RlLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgZGF0YVN0cik7XHJcbiAgICBkb3dubG9hZEFuY2hvck5vZGUuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIiwgZXhwb3J0TmFtZSArIFwiLmpzb25cIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvd25sb2FkQW5jaG9yTm9kZSk7IC8vIHJlcXVpcmVkIGZvciBmaXJlZm94XHJcbiAgICBkb3dubG9hZEFuY2hvck5vZGUuY2xpY2soKTtcclxuICAgIGRvd25sb2FkQW5jaG9yTm9kZS5yZW1vdmUoKTtcclxufVxyXG4vLyBiaW5kIGRvd25sb2FkIGJ1dHRvblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgY29uc3Qgb3V0RGF0YSA9IFtdO1xyXG4gICAgc2tldGNoLmdldERyYXduT2JqZWN0cygpLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZWxlbS5ncmFwaGljLmdlb21ldHJ5LmdyYXBoaWNzRGF0YVswXS5wb2ludHM7XHJcbiAgICAgICAgLy8gZ2V0dGluZyBib3VkaW5nIHJlY3QncyBjZW50ZXIgb2YgdGhlIGdyYXBoaWNcclxuICAgICAgICBjb25zdCBib3VuZFJlY3QgPSBlbGVtLmdyYXBoaWMuZ2V0TG9jYWxCb3VuZHMoKTtcclxuICAgICAgICBjb25zdCBjeCA9IChib3VuZFJlY3QubGVmdCArIGJvdW5kUmVjdC5yaWdodCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGN5ID0gKGJvdW5kUmVjdC50b3AgKyBib3VuZFJlY3QuYm90dG9tKSAvIDI7XHJcbiAgICAgICAgLy8gY29udmVydGluZyB0aGUgcG9pbnRzIHRvIGxvY2FsIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgcG9pbnRzW2ldIC09IGN4O1xyXG4gICAgICAgICAgICBwb2ludHNbaSArIDFdIC09IGN5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXREYXRhLnB1c2goe1xyXG4gICAgICAgICAgICBnZW9tZXRyeTogcG9pbnRzLFxyXG4gICAgICAgICAgICBuYW1lOiBlbGVtLm5hbWUsXHJcbiAgICAgICAgICAgIHg6IGN4LFxyXG4gICAgICAgICAgICB5OiBjeVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkb3dubG9hZE9iamVjdEFzSnNvbihvdXREYXRhLCBcIm11c2NsZXNcIik7XHJcbiAgICBza2V0Y2guY2xlYXJBbGxEcmF3bk9iamVjdHMoKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzZXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIHNrZXRjaC5yZXNldEN1cnJlbnQoKTtcclxufSk7XHJcbiIsImltcG9ydCB7IENvbnRhaW5lciwgU3ByaXRlLCBHcmFwaGljcywgTElORV9DQVAsIExJTkVfSk9JTiB9IGZyb20gXCJwaXhpLmpzXCI7XHJcbmltcG9ydCBhc3NldHMgZnJvbSAnLi9hc3NldHMnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa2V0Y2ggZXh0ZW5kcyBDb250YWluZXIge1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgICAgIExpZmVDeWNsZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmRyYXduT2JqZWN0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbmV3IEdyYXBoaWNzKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5hbWUgPSAnJztcclxuICAgICAgICAvLyBTZXR0aW5nIGJhc2ljIGNvbnRleHRcclxuICAgICAgICB0aGlzLnNjcmVlbldpZHRoID0gc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgdGhpcy5zY3JlZW5IZWlnaHQgPSBzY3JlZW5IZWlnaHQ7XHJcbiAgICAgICAgLy8gTG9hZCBiYXNlIGJpdG1hcFxyXG4gICAgICAgIGNvbnN0IGJhc2VJbWFnZUFzc2V0ID0gYXNzZXRzLmJhc2VJbWFnZTtcclxuICAgICAgICBjb25zdCBiYXNlSW1hZ2UgPSB0aGlzLmJhc2VJbWFnZSA9IFNwcml0ZS5mcm9tKGFzc2V0cy5iYXNlSW1hZ2UucGF0aCk7XHJcbiAgICAgICAgLy8gQ2VudGVyIHRoZSBiYXNlIGltYWdlXHJcbiAgICAgICAgYmFzZUltYWdlLmFuY2hvci5zZXQoMC41LCAwLjUpO1xyXG4gICAgICAgIGJhc2VJbWFnZS54ID0gc2NyZWVuV2lkdGggLyAyO1xyXG4gICAgICAgIGJhc2VJbWFnZS55ID0gc2NyZWVuSGVpZ2h0IC8gMjtcclxuICAgICAgICAvLyBBZGRpbmcgYmFzZSBpbWFnZSB0byB0aGUgc3RhZ2VcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuYmFzZUltYWdlKTtcclxuICAgICAgICAvLyBiaW5kaW5nIGRyYXdpbmcgZXZlbnRzXHJcbiAgICAgICAgYmFzZUltYWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBiYXNlSW1hZ2Uub24oJ2NsaWNrJywgdGhpcy5vbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGJhc2VJbWFnZS5vbigncmlnaHRjbGljaycsIHRoaXMub25SaWdodENsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGJhc2VJbWFnZS5hZGRDaGlsZCh0aGlzLmN1cnJlbnRPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgICAgIEV2ZW50IEhhbmRsZXJzXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIG9uQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTGVmdCBDbGlja2VkJyk7XHJcbiAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IHB0ID0gZXZlbnQuZGF0YS5nZXRMb2NhbFBvc2l0aW9uKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocHQpO1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudE9iamVjdCwgY3VycmVudFBhdGggfSA9IHRoaXM7XHJcbiAgICAgICAgY3VycmVudFBhdGgucHVzaChwdCk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5jbGVhcigpO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuYmVnaW5GaWxsKDB4ZmYwMDAwKTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmxpbmVTdHlsZSh7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxLFxyXG4gICAgICAgICAgICBjb2xvcjogMHgwMGZmMDAsXHJcbiAgICAgICAgICAgIGNhcDogTElORV9DQVAuUk9VTkQsXHJcbiAgICAgICAgICAgIGpvaW46IExJTkVfSk9JTi5ST1VORFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QubW92ZVRvKGN1cnJlbnRQYXRoWzBdLngsIGN1cnJlbnRQYXRoWzBdLnkpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3VycmVudFBhdGgubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY3VycmVudE9iamVjdC5saW5lVG8oY3VycmVudFBhdGhbaV0ueCwgY3VycmVudFBhdGhbaV0ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QubGluZVRvKGN1cnJlbnRQYXRoWzBdLngsIGN1cnJlbnRQYXRoWzBdLnkpO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuZW5kRmlsbCgpO1xyXG4gICAgfVxyXG4gICAgb25SaWdodENsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JpZ2h0IENsaWNrZWQnKTtcclxuICAgICAgICB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ05lZWQgbW9yZSB0aGFuIDMgcG9pbnRzJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnROYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGVydCgnWW91IGhhdmUgdG8gbmFtZSB0aGUgbXVzY2xlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3bk9iamVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgIGdyYXBoaWM6IHRoaXMuY3VycmVudE9iamVjdCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5jdXJyZW50TmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdCA9IG5ldyBHcmFwaGljcygpO1xyXG4gICAgICAgIHRoaXMuYmFzZUltYWdlLmFkZENoaWxkKHRoaXMuY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNjbGUtbmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TmFtZSA9ICcnO1xyXG4gICAgfVxyXG4gICAgc2V0Q3VycmVudE5hbWUobmFtZSkgeyB0aGlzLmN1cnJlbnROYW1lID0gbmFtZTsgfVxyXG4gICAgZ2V0RHJhd25PYmplY3RzKCkgeyByZXR1cm4gdGhpcy5kcmF3bk9iamVjdHM7IH1cclxuICAgIGNsZWFyQWxsRHJhd25PYmplY3RzKCkge1xyXG4gICAgICAgIHRoaXMuZHJhd25PYmplY3RzLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW0uZ3JhcGhpYy5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kcmF3bk9iamVjdHMgPSBbXTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gW107XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLmJhc2VJbWFnZS5hZGRDaGlsZCh0aGlzLmN1cnJlbnRPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRDdXJyZW50KCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdC5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbmV3IEdyYXBoaWNzKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIHRoaXMuYmFzZUltYWdlLmFkZENoaWxkKHRoaXMuY3VycmVudE9iamVjdCk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiaW5kZXhcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19waXhpX2pzX2Rpc3RfZXNtX3BpeGlfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2NyaXB0cy9pbmRleC5qc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9