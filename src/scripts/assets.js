/**
 * Main Assets
 */
const baseImagePath = require('../assets/base-image.png');
const muscles = require('../assets/muscles.json');
export const mainAssets = {
    baseImage: {
        name: "baseImage",
        path: baseImagePath,
    },
    muscles
};
/**
 * Pointer Assets
 */
const outterPath = require('../assets/pointer/outter.svg');
const innerPath = require('../assets/pointer/inner.svg');
const crossPath = require('../assets/pointer/cross.svg');
export const pointerAssets = {
    outter: outterPath,
    inner: innerPath,
    cross: crossPath
};
