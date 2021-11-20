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
        this.currentName = document.getElementById('muscle-name').value;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rZWVwLWZpdC8uL3NyYy9zY3JpcHRzL2Fzc2V0cy5qcyIsIndlYnBhY2s6Ly9rZWVwLWZpdC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIiwid2VicGFjazovL2tlZXAtZml0Ly4vc3JjL3NjcmlwdHMvc2tldGNoLmpzIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGJhc2VJbWFnZVBhdGggPSByZXF1aXJlKCcuLi9hc3NldHMvYmFzZS1pbWFnZS5wbmcnKTtcclxuY29uc3QgYXNzZXRzID0ge1xyXG4gICAgXCJiYXNlSW1hZ2VcIjoge1xyXG4gICAgICAgIG5hbWU6IFwiYmFzZUltYWdlXCIsXHJcbiAgICAgICAgcGF0aDogYmFzZUltYWdlUGF0aCxcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDAsXHJcbiAgICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBhc3NldHM7XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAncGl4aS5qcyc7XHJcbmNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbih7XHJcbiAgICB2aWV3OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpeGktY2FudmFzXCIpLFxyXG4gICAgcmVzb2x1dGlvbjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcclxuICAgIGF1dG9EZW5zaXR5OiB0cnVlLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweDY0OTVlZCxcclxuICAgIHdpZHRoOiAxMDI0LFxyXG4gICAgaGVpZ2h0OiA3NjhcclxufSk7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxufSk7XHJcbmltcG9ydCBTa2V0Y2ggZnJvbSAnLi9za2V0Y2gnO1xyXG5jb25zdCBza2V0Y2ggPSBuZXcgU2tldGNoKGFwcC5zY3JlZW4ud2lkdGgsIGFwcC5zY3JlZW4uaGVpZ2h0KTtcclxuYXBwLnN0YWdlLmFkZENoaWxkKHNrZXRjaCk7XHJcbi8vIGJpbmQgaW5wdXRcclxuY29uc3QgaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211c2NsZS1uYW1lJyk7XHJcbmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChlKSA9PiB7XHJcbiAgICBza2V0Y2guc2V0Q3VycmVudE5hbWUoaW5wdXRFbGVtZW50LnZhbHVlKTtcclxufSk7XHJcbi8vIGRvd25sb2FkIHNlcnZpY2VcclxuZnVuY3Rpb24gZG93bmxvYWRPYmplY3RBc0pzb24oZXhwb3J0T2JqLCBleHBvcnROYW1lKSB7XHJcbiAgICB2YXIgZGF0YVN0ciA9IFwiZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGYtOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShleHBvcnRPYmopKTtcclxuICAgIHZhciBkb3dubG9hZEFuY2hvck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBkb3dubG9hZEFuY2hvck5vZGUuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBkYXRhU3RyKTtcclxuICAgIGRvd25sb2FkQW5jaG9yTm9kZS5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCBleHBvcnROYW1lICsgXCIuanNvblwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG93bmxvYWRBbmNob3JOb2RlKTsgLy8gcmVxdWlyZWQgZm9yIGZpcmVmb3hcclxuICAgIGRvd25sb2FkQW5jaG9yTm9kZS5jbGljaygpO1xyXG4gICAgZG93bmxvYWRBbmNob3JOb2RlLnJlbW92ZSgpO1xyXG59XHJcbi8vIGJpbmQgZG93bmxvYWQgYnV0dG9uXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG93bmxvYWRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICBjb25zdCBvdXREYXRhID0gW107XHJcbiAgICBza2V0Y2guZ2V0RHJhd25PYmplY3RzKCkuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBlbGVtLmdyYXBoaWMuZ2VvbWV0cnkuZ3JhcGhpY3NEYXRhWzBdLnBvaW50cztcclxuICAgICAgICAvLyBnZXR0aW5nIGJvdWRpbmcgcmVjdCdzIGNlbnRlciBvZiB0aGUgZ3JhcGhpY1xyXG4gICAgICAgIGNvbnN0IGJvdW5kUmVjdCA9IGVsZW0uZ3JhcGhpYy5nZXRMb2NhbEJvdW5kcygpO1xyXG4gICAgICAgIGNvbnN0IGN4ID0gKGJvdW5kUmVjdC5sZWZ0ICsgYm91bmRSZWN0LnJpZ2h0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY3kgPSAoYm91bmRSZWN0LnRvcCArIGJvdW5kUmVjdC5ib3R0b20pIC8gMjtcclxuICAgICAgICAvLyBjb252ZXJ0aW5nIHRoZSBwb2ludHMgdG8gbG9jYWwgY29vcmRpbmF0ZXNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICBwb2ludHNbaV0gLT0gY3g7XHJcbiAgICAgICAgICAgIHBvaW50c1tpICsgMV0gLT0gY3k7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dERhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIGdlb21ldHJ5OiBwb2ludHMsXHJcbiAgICAgICAgICAgIG5hbWU6IGVsZW0ubmFtZSxcclxuICAgICAgICAgICAgeDogY3gsXHJcbiAgICAgICAgICAgIHk6IGN5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRvd25sb2FkT2JqZWN0QXNKc29uKG91dERhdGEsIFwibXVzY2xlc1wiKTtcclxuICAgIHNrZXRjaC5jbGVhckFsbERyYXduT2JqZWN0cygpO1xyXG59KTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgc2tldGNoLnJlc2V0Q3VycmVudCgpO1xyXG59KTtcclxuIiwiaW1wb3J0IHsgQ29udGFpbmVyLCBTcHJpdGUsIEdyYXBoaWNzLCBMSU5FX0NBUCwgTElORV9KT0lOIH0gZnJvbSBcInBpeGkuanNcIjtcclxuaW1wb3J0IGFzc2V0cyBmcm9tICcuL2Fzc2V0cyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNrZXRjaCBleHRlbmRzIENvbnRhaW5lciB7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgTGlmZUN5Y2xlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGNvbnN0cnVjdG9yKHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd25PYmplY3RzID0gW107XHJcbiAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gW107XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TmFtZSA9ICcnO1xyXG4gICAgICAgIC8vIFNldHRpbmcgYmFzaWMgY29udGV4dFxyXG4gICAgICAgIHRoaXMuc2NyZWVuV2lkdGggPSBzY3JlZW5XaWR0aDtcclxuICAgICAgICB0aGlzLnNjcmVlbkhlaWdodCA9IHNjcmVlbkhlaWdodDtcclxuICAgICAgICAvLyBMb2FkIGJhc2UgYml0bWFwXHJcbiAgICAgICAgY29uc3QgYmFzZUltYWdlQXNzZXQgPSBhc3NldHMuYmFzZUltYWdlO1xyXG4gICAgICAgIGNvbnN0IGJhc2VJbWFnZSA9IHRoaXMuYmFzZUltYWdlID0gU3ByaXRlLmZyb20oYXNzZXRzLmJhc2VJbWFnZS5wYXRoKTtcclxuICAgICAgICAvLyBDZW50ZXIgdGhlIGJhc2UgaW1hZ2VcclxuICAgICAgICBiYXNlSW1hZ2UuYW5jaG9yLnNldCgwLjUsIDAuNSk7XHJcbiAgICAgICAgYmFzZUltYWdlLnggPSBzY3JlZW5XaWR0aCAvIDI7XHJcbiAgICAgICAgYmFzZUltYWdlLnkgPSBzY3JlZW5IZWlnaHQgLyAyO1xyXG4gICAgICAgIC8vIEFkZGluZyBiYXNlIGltYWdlIHRvIHRoZSBzdGFnZVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iYXNlSW1hZ2UpO1xyXG4gICAgICAgIC8vIGJpbmRpbmcgZHJhd2luZyBldmVudHNcclxuICAgICAgICBiYXNlSW1hZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGJhc2VJbWFnZS5vbignY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgYmFzZUltYWdlLm9uKCdyaWdodGNsaWNrJywgdGhpcy5vblJpZ2h0Q2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICAgICAgYmFzZUltYWdlLmFkZENoaWxkKHRoaXMuY3VycmVudE9iamVjdCk7XHJcbiAgICB9XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgRXZlbnQgSGFuZGxlcnNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgb25DbGljayhldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMZWZ0IENsaWNrZWQnKTtcclxuICAgICAgICB0aGlzLmlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgcHQgPSBldmVudC5kYXRhLmdldExvY2FsUG9zaXRpb24oZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwdCk7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50T2JqZWN0LCBjdXJyZW50UGF0aCB9ID0gdGhpcztcclxuICAgICAgICBjdXJyZW50UGF0aC5wdXNoKHB0KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmNsZWFyKCk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5iZWdpbkZpbGwoMHhmZjAwMDApO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QubGluZVN0eWxlKHtcclxuICAgICAgICAgICAgd2lkdGg6IDEsXHJcbiAgICAgICAgICAgIGNvbG9yOiAweDAwZmYwMCxcclxuICAgICAgICAgICAgY2FwOiBMSU5FX0NBUC5ST1VORCxcclxuICAgICAgICAgICAgam9pbjogTElORV9KT0lOLlJPVU5EXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5tb3ZlVG8oY3VycmVudFBhdGhbMF0ueCwgY3VycmVudFBhdGhbMF0ueSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjdXJyZW50UGF0aC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjdXJyZW50T2JqZWN0LmxpbmVUbyhjdXJyZW50UGF0aFtpXS54LCBjdXJyZW50UGF0aFtpXS55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5saW5lVG8oY3VycmVudFBhdGhbMF0ueCwgY3VycmVudFBhdGhbMF0ueSk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5lbmRGaWxsKCk7XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0Q2xpY2soZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUmlnaHQgQ2xpY2tlZCcpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzY2xlLW5hbWUnKS52YWx1ZTtcclxuICAgICAgICB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ05lZWQgbW9yZSB0aGFuIDMgcG9pbnRzJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnROYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGVydCgnWW91IGhhdmUgdG8gbmFtZSB0aGUgbXVzY2xlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3bk9iamVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgIGdyYXBoaWM6IHRoaXMuY3VycmVudE9iamVjdCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5jdXJyZW50TmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdCA9IG5ldyBHcmFwaGljcygpO1xyXG4gICAgICAgIHRoaXMuYmFzZUltYWdlLmFkZENoaWxkKHRoaXMuY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXNjbGUtbmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TmFtZSA9ICcnO1xyXG4gICAgfVxyXG4gICAgc2V0Q3VycmVudE5hbWUobmFtZSkgeyB0aGlzLmN1cnJlbnROYW1lID0gbmFtZTsgfVxyXG4gICAgZ2V0RHJhd25PYmplY3RzKCkgeyByZXR1cm4gdGhpcy5kcmF3bk9iamVjdHM7IH1cclxuICAgIGNsZWFyQWxsRHJhd25PYmplY3RzKCkge1xyXG4gICAgICAgIHRoaXMuZHJhd25PYmplY3RzLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW0uZ3JhcGhpYy5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kcmF3bk9iamVjdHMgPSBbXTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gW107XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLmJhc2VJbWFnZS5hZGRDaGlsZCh0aGlzLmN1cnJlbnRPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRDdXJyZW50KCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudE9iamVjdC5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbmV3IEdyYXBoaWNzKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IFtdO1xyXG4gICAgICAgIHRoaXMuYmFzZUltYWdlLmFkZENoaWxkKHRoaXMuY3VycmVudE9iamVjdCk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiaW5kZXhcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19waXhpX2pzX2Rpc3RfZXNtX3BpeGlfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2NyaXB0cy9pbmRleC5qc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9