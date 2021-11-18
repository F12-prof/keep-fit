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
const muscles = __webpack_require__(/*! ../assets/muscles.json */ "./src/assets/muscles.json");
const assets = {
    baseImage: {
        name: "baseImage",
        path: baseImagePath,
    },
    muscles
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assets);


/***/ }),

/***/ "./src/scripts/human.js":
/*!******************************!*\
  !*** ./src/scripts/human.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Human)
/* harmony export */ });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets */ "./src/scripts/assets.js");


class Human extends pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight, _lineStyle, _fillStyle) {
        super();
        this.muscles = [];
        this.lineStyle = {
            color: 0xffffff,
            width: 2,
            alpha: 0.75,
            cap: pixi_js__WEBPACK_IMPORTED_MODULE_0__.LINE_CAP.ROUND,
            join: pixi_js__WEBPACK_IMPORTED_MODULE_0__.LINE_JOIN.ROUND,
        };
        this.fillStyle = {
            color: 0xff8800,
            alpha: 0.25,
        };
        // Setting basic context
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        // Setting default style if not specified
        if (_lineStyle)
            this.lineStyle = _lineStyle;
        if (_fillStyle)
            this.fillStyle = _fillStyle;
        // Load base bitmap
        const baseImageAsset = _assets__WEBPACK_IMPORTED_MODULE_1__["default"].baseImage;
        const baseImage = this.baseImage = pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite.from(_assets__WEBPACK_IMPORTED_MODULE_1__["default"].baseImage.path);
        // Center the base image
        baseImage.anchor.set(0.5, 0.5);
        baseImage.x = screenWidth / 2;
        baseImage.y = screenHeight / 2;
        // Adding base image to the stage
        this.addChild(this.baseImage);
        // Load muscles blocks and add each muscle element to the stage
        this.loadMusclesFromParsedObject(_assets__WEBPACK_IMPORTED_MODULE_1__["default"].muscles);
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onMouseEnterMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        const muscleGraphic = muscle.graphic;
        console.log("Mouse entering", muscle.name);
        muscleGraphic.scale.set(1.1);
    }
    onMouseLeaveMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        const muscleGraphic = muscle.graphic;
        console.log("Mouse leaving", muscle.name);
        muscleGraphic.scale.set(1.0);
    }
    //-------------------------------
    //      Private Methods
    //-------------------------------
    getMuscleFromEvent(event) {
        for (let muscle of this.muscles) {
            if (muscle.graphic === event.target)
                return muscle;
        }
    }
    loadMusclesFromParsedObject(musclesData) {
        musclesData.forEach((muscleData) => {
            // Create new graphic for muscle with geomery in json
            const muscleGraphic = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics();
            // Restore the status of the graphic
            const points = muscleData.geometry;
            muscleGraphic.beginFill(this.fillStyle.color, this.fillStyle.alpha);
            muscleGraphic.lineStyle(this.lineStyle);
            muscleGraphic.moveTo(points[0], points[1]);
            for (let i = 2; i < points.length; i += 2) {
                muscleGraphic.lineTo(points[i], points[i + 1]);
            }
            muscleGraphic.endFill();
            this.muscles.push({
                graphic: muscleGraphic,
                name: muscleData.name,
                attributes: {}
            });
            // Append the graphic to base image
            this.baseImage.addChild(muscleGraphic);
            console.log(muscleGraphic);
            // Bind event handlers
            muscleGraphic.interactive = true;
            muscleGraphic.on('pointertap', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerenter', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerleave', this.onMouseLeaveMuscle.bind(this));
        });
    }
}


/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _human__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./human */ "./src/scripts/human.js");

const app = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Application({
    view: document.getElementById("pixi-canvas"),
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 1024,
    height: 768
});

app.stage.addChild(new _human__WEBPACK_IMPORTED_MODULE_1__["default"](app.screen.width, app.screen.height));


/***/ }),

/***/ "./src/assets/base-image.png":
/*!***********************************!*\
  !*** ./src/assets/base-image.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "98856d51bbe23ccf5f07.png";

/***/ }),

/***/ "./src/assets/muscles.json":
/*!*********************************!*\
  !*** ./src/assets/muscles.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"geometry":{"points":[13.111099243164062,-148.11111450195312,25.77777099609375,-145.88888549804688,37.5555419921875,-142.55555725097656,43.11109924316406,-140.11111450195312,49.5555419921875,-135.6666717529297,51.33332824707031,-127.44444274902344,46.44444274902344,-121.66667175292969,43.5555419921875,-117.44444274902344,40.888885498046875,-111.44444274902344,36.22221374511719,-108.33332824707031,31.999984741210938,-108.5555419921875,24.222213745117188,-110.77777099609375,19.77777099609375,-112.77777099609375,14.222213745117188,-118.5555419921875,11.77777099609375,-125.88887023925781,11.555549621582031,-131.6666717529297,10.888877868652344,-136.11111450195312,11.555549621582031,-141.6666717529297,13.111099243164062,-148.11111450195312],"holes":[],"shape":{"points":[13.111099243164062,-148.11111450195312,25.77777099609375,-145.88888549804688,37.5555419921875,-142.55555725097656,43.11109924316406,-140.11111450195312,49.5555419921875,-135.6666717529297,51.33332824707031,-127.44444274902344,46.44444274902344,-121.66667175292969,43.5555419921875,-117.44444274902344,40.888885498046875,-111.44444274902344,36.22221374511719,-108.33332824707031,31.999984741210938,-108.5555419921875,24.222213745117188,-110.77777099609375,19.77777099609375,-112.77777099609375,14.222213745117188,-118.5555419921875,11.77777099609375,-125.88887023925781,11.555549621582031,-131.6666717529297,10.888877868652344,-136.11111450195312,11.555549621582031,-141.6666717529297,13.111099243164062,-148.11111450195312],"type":0,"closeStroke":false},"lineStyle":null,"fillStyle":null,"matrix":null,"type":0},"name":"deltoid"},{"geometry":{"points":[20.333343505859375,125.50003051757812,18.000030517578125,137.16668701171875,15.333343505859375,145.16668701171875,14.333343505859375,152.50003051757812,12.66668701171875,162.8333740234375,11.66668701171875,175.8333740234375,11.000030517578125,186.8333740234375,14.000030517578125,198.8333740234375,12.333343505859375,210.8333740234375,14.66668701171875,216.16668701171875,17.333343505859375,217.50003051757812,18.333343505859375,196.50003051757812,21.66668701171875,178.8333740234375,24.66668701171875,162.16668701171875,25.66668701171875,152.8333740234375,25.66668701171875,138.83335876464844,23.66668701171875,131.50003051757812,20.333343505859375,125.50003051757812],"holes":[],"shape":{"points":[20.333343505859375,125.50003051757812,18.000030517578125,137.16668701171875,15.333343505859375,145.16668701171875,14.333343505859375,152.50003051757812,12.66668701171875,162.8333740234375,11.66668701171875,175.8333740234375,11.000030517578125,186.8333740234375,14.000030517578125,198.8333740234375,12.333343505859375,210.8333740234375,14.66668701171875,216.16668701171875,17.333343505859375,217.50003051757812,18.333343505859375,196.50003051757812,21.66668701171875,178.8333740234375,24.66668701171875,162.16668701171875,25.66668701171875,152.8333740234375,25.66668701171875,138.83335876464844,23.66668701171875,131.50003051757812,20.333343505859375,125.50003051757812],"type":0,"closeStroke":false},"lineStyle":null,"fillStyle":null,"matrix":null,"type":0},"name":"tibialis-anterior"},{"geometry":{"points":[-0.8888702392578125,231.00001525878906,13.111129760742188,231.6666717529297,12.000015258789062,239.44447326660156,9.777801513671875,247.88890075683594,9.777801513671875,254.33334350585938,9.111129760742188,261.88890075683594,4.4444580078125,267.4444580078125,-0.8888702392578125,265.6666717529297,-4.444427490234375,261.6666717529297,-2.444427490234375,248.77780151367188,-1.9999847412109375,238.33334350585938,-0.8888702392578125,231.00001525878906],"holes":[],"shape":{"points":[-0.8888702392578125,231.00001525878906,13.111129760742188,231.6666717529297,12.000015258789062,239.44447326660156,9.777801513671875,247.88890075683594,9.777801513671875,254.33334350585938,9.111129760742188,261.88890075683594,4.4444580078125,267.4444580078125,-0.8888702392578125,265.6666717529297,-4.444427490234375,261.6666717529297,-2.444427490234375,248.77780151367188,-1.9999847412109375,238.33334350585938,-0.8888702392578125,231.00001525878906],"type":0,"closeStroke":false},"lineStyle":null,"fillStyle":null,"matrix":null,"type":0},"name":"extensor-muscles"}]');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2tlZXAtZml0Ly4vc3JjL3NjcmlwdHMvYXNzZXRzLmpzIiwid2VicGFjazovL2tlZXAtZml0Ly4vc3JjL3NjcmlwdHMvaHVtYW4uanMiLCJ3ZWJwYWNrOi8va2VlcC1maXQvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9rZWVwLWZpdC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8va2VlcC1maXQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2tlZXAtZml0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBiYXNlSW1hZ2VQYXRoID0gcmVxdWlyZSgnLi4vYXNzZXRzL2Jhc2UtaW1hZ2UucG5nJyk7XHJcbmNvbnN0IG11c2NsZXMgPSByZXF1aXJlKCcuLi9hc3NldHMvbXVzY2xlcy5qc29uJyk7XHJcbmNvbnN0IGFzc2V0cyA9IHtcclxuICAgIGJhc2VJbWFnZToge1xyXG4gICAgICAgIG5hbWU6IFwiYmFzZUltYWdlXCIsXHJcbiAgICAgICAgcGF0aDogYmFzZUltYWdlUGF0aCxcclxuICAgIH0sXHJcbiAgICBtdXNjbGVzXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGFzc2V0cztcclxuIiwiaW1wb3J0IHsgQ29udGFpbmVyLCBTcHJpdGUsIExJTkVfQ0FQLCBMSU5FX0pPSU4sIEdyYXBoaWNzIH0gZnJvbSBcInBpeGkuanNcIjtcclxuaW1wb3J0IGFzc2V0cyBmcm9tICcuL2Fzc2V0cyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1bWFuIGV4dGVuZHMgQ29udGFpbmVyIHtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gICAgICBMaWZlQ3ljbGVcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCwgX2xpbmVTdHlsZSwgX2ZpbGxTdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tdXNjbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5saW5lU3R5bGUgPSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAweGZmZmZmZixcclxuICAgICAgICAgICAgd2lkdGg6IDIsXHJcbiAgICAgICAgICAgIGFscGhhOiAwLjc1LFxyXG4gICAgICAgICAgICBjYXA6IExJTkVfQ0FQLlJPVU5ELFxyXG4gICAgICAgICAgICBqb2luOiBMSU5FX0pPSU4uUk9VTkQsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZpbGxTdHlsZSA9IHtcclxuICAgICAgICAgICAgY29sb3I6IDB4ZmY4ODAwLFxyXG4gICAgICAgICAgICBhbHBoYTogMC4yNSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFNldHRpbmcgYmFzaWMgY29udGV4dFxyXG4gICAgICAgIHRoaXMuc2NyZWVuV2lkdGggPSBzY3JlZW5XaWR0aDtcclxuICAgICAgICB0aGlzLnNjcmVlbkhlaWdodCA9IHNjcmVlbkhlaWdodDtcclxuICAgICAgICAvLyBTZXR0aW5nIGRlZmF1bHQgc3R5bGUgaWYgbm90IHNwZWNpZmllZFxyXG4gICAgICAgIGlmIChfbGluZVN0eWxlKVxyXG4gICAgICAgICAgICB0aGlzLmxpbmVTdHlsZSA9IF9saW5lU3R5bGU7XHJcbiAgICAgICAgaWYgKF9maWxsU3R5bGUpXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFN0eWxlID0gX2ZpbGxTdHlsZTtcclxuICAgICAgICAvLyBMb2FkIGJhc2UgYml0bWFwXHJcbiAgICAgICAgY29uc3QgYmFzZUltYWdlQXNzZXQgPSBhc3NldHMuYmFzZUltYWdlO1xyXG4gICAgICAgIGNvbnN0IGJhc2VJbWFnZSA9IHRoaXMuYmFzZUltYWdlID0gU3ByaXRlLmZyb20oYXNzZXRzLmJhc2VJbWFnZS5wYXRoKTtcclxuICAgICAgICAvLyBDZW50ZXIgdGhlIGJhc2UgaW1hZ2VcclxuICAgICAgICBiYXNlSW1hZ2UuYW5jaG9yLnNldCgwLjUsIDAuNSk7XHJcbiAgICAgICAgYmFzZUltYWdlLnggPSBzY3JlZW5XaWR0aCAvIDI7XHJcbiAgICAgICAgYmFzZUltYWdlLnkgPSBzY3JlZW5IZWlnaHQgLyAyO1xyXG4gICAgICAgIC8vIEFkZGluZyBiYXNlIGltYWdlIHRvIHRoZSBzdGFnZVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iYXNlSW1hZ2UpO1xyXG4gICAgICAgIC8vIExvYWQgbXVzY2xlcyBibG9ja3MgYW5kIGFkZCBlYWNoIG11c2NsZSBlbGVtZW50IHRvIHRoZSBzdGFnZVxyXG4gICAgICAgIHRoaXMubG9hZE11c2NsZXNGcm9tUGFyc2VkT2JqZWN0KGFzc2V0cy5tdXNjbGVzKTtcclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gICAgICBFdmVudCBIYW5kbGVyc1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBvbk1vdXNlRW50ZXJNdXNjbGUoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBtdXNjbGUgPSB0aGlzLmdldE11c2NsZUZyb21FdmVudChldmVudCk7XHJcbiAgICAgICAgY29uc3QgbXVzY2xlR3JhcGhpYyA9IG11c2NsZS5ncmFwaGljO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW91c2UgZW50ZXJpbmdcIiwgbXVzY2xlLm5hbWUpO1xyXG4gICAgICAgIG11c2NsZUdyYXBoaWMuc2NhbGUuc2V0KDEuMSk7XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlTGVhdmVNdXNjbGUoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBtdXNjbGUgPSB0aGlzLmdldE11c2NsZUZyb21FdmVudChldmVudCk7XHJcbiAgICAgICAgY29uc3QgbXVzY2xlR3JhcGhpYyA9IG11c2NsZS5ncmFwaGljO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW91c2UgbGVhdmluZ1wiLCBtdXNjbGUubmFtZSk7XHJcbiAgICAgICAgbXVzY2xlR3JhcGhpYy5zY2FsZS5zZXQoMS4wKTtcclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gICAgICBQcml2YXRlIE1ldGhvZHNcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZ2V0TXVzY2xlRnJvbUV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgZm9yIChsZXQgbXVzY2xlIG9mIHRoaXMubXVzY2xlcykge1xyXG4gICAgICAgICAgICBpZiAobXVzY2xlLmdyYXBoaWMgPT09IGV2ZW50LnRhcmdldClcclxuICAgICAgICAgICAgICAgIHJldHVybiBtdXNjbGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbG9hZE11c2NsZXNGcm9tUGFyc2VkT2JqZWN0KG11c2NsZXNEYXRhKSB7XHJcbiAgICAgICAgbXVzY2xlc0RhdGEuZm9yRWFjaCgobXVzY2xlRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGdyYXBoaWMgZm9yIG11c2NsZSB3aXRoIGdlb21lcnkgaW4ganNvblxyXG4gICAgICAgICAgICBjb25zdCBtdXNjbGVHcmFwaGljID0gbmV3IEdyYXBoaWNzKCk7XHJcbiAgICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIHN0YXR1cyBvZiB0aGUgZ3JhcGhpY1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludHMgPSBtdXNjbGVEYXRhLmdlb21ldHJ5O1xyXG4gICAgICAgICAgICBtdXNjbGVHcmFwaGljLmJlZ2luRmlsbCh0aGlzLmZpbGxTdHlsZS5jb2xvciwgdGhpcy5maWxsU3R5bGUuYWxwaGEpO1xyXG4gICAgICAgICAgICBtdXNjbGVHcmFwaGljLmxpbmVTdHlsZSh0aGlzLmxpbmVTdHlsZSk7XHJcbiAgICAgICAgICAgIG11c2NsZUdyYXBoaWMubW92ZVRvKHBvaW50c1swXSwgcG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIG11c2NsZUdyYXBoaWMubGluZVRvKHBvaW50c1tpXSwgcG9pbnRzW2kgKyAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXVzY2xlR3JhcGhpYy5lbmRGaWxsKCk7XHJcbiAgICAgICAgICAgIHRoaXMubXVzY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGdyYXBoaWM6IG11c2NsZUdyYXBoaWMsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBtdXNjbGVEYXRhLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBncmFwaGljIHRvIGJhc2UgaW1hZ2VcclxuICAgICAgICAgICAgdGhpcy5iYXNlSW1hZ2UuYWRkQ2hpbGQobXVzY2xlR3JhcGhpYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG11c2NsZUdyYXBoaWMpO1xyXG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgICAgIG11c2NsZUdyYXBoaWMuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBtdXNjbGVHcmFwaGljLm9uKCdwb2ludGVydGFwJywgdGhpcy5vbk1vdXNlRW50ZXJNdXNjbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIG11c2NsZUdyYXBoaWMub24oJ3BvaW50ZXJlbnRlcicsIHRoaXMub25Nb3VzZUVudGVyTXVzY2xlLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBtdXNjbGVHcmFwaGljLm9uKCdwb2ludGVybGVhdmUnLCB0aGlzLm9uTW91c2VMZWF2ZU11c2NsZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ3BpeGkuanMnO1xyXG5jb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oe1xyXG4gICAgdmlldzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaXhpLWNhbnZhc1wiKSxcclxuICAgIHJlc29sdXRpb246IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXHJcbiAgICBhdXRvRGVuc2l0eTogdHJ1ZSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogMHg2NDk1ZWQsXHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNzY4XHJcbn0pO1xyXG5pbXBvcnQgSHVtYW4gZnJvbSAnLi9odW1hbic7XHJcbmFwcC5zdGFnZS5hZGRDaGlsZChuZXcgSHVtYW4oYXBwLnNjcmVlbi53aWR0aCwgYXBwLnNjcmVlbi5oZWlnaHQpKTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiaW5kZXhcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdID0gc2VsZltcIndlYnBhY2tDaHVua2tlZXBfZml0XCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19waXhpX2pzX2Rpc3RfZXNtX3BpeGlfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2NyaXB0cy9pbmRleC5qc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9