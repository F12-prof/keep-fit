import { AssetType } from './interfaces';

/**
 * Main Assets
 */

const baseImagePath = require('../assets/base-image.png');
const muscles = require('../assets/muscles.json');

export const mainAssets: AssetType = {
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
}


/**
 * Matrix background Assets
 */

const binNumPath0 = require('../assets/matrix/01s_0.png');
const binNumPath1 = require('../assets/matrix/01s_1.png');
const binNumPath2 = require('../assets/matrix/01s_2.png');
const binNumPath3 = require('../assets/matrix/01s_3.png');
const binNumPath4 = require('../assets/matrix/01s_4.png');
const binNumPath5 = require('../assets/matrix/01s_5.png');
const binNumPath6 = require('../assets/matrix/01s_6.png');
const binNumPath7 = require('../assets/matrix/01s_7.png');
const binNumPath8 = require('../assets/matrix/01s_8.png');
const binNumPath9 = require('../assets/matrix/01s_9.png');

const emitterSetting = require('../assets/matrix/emitter.json');

const particleTexturePath = require('../assets/matrix/texture.png');


export const matrixAssets = {
    binaryColumns: [
        binNumPath0,
        binNumPath1,
        binNumPath2,
        binNumPath3,
        binNumPath4,
        binNumPath5,
        binNumPath6,
        binNumPath7,
        binNumPath8,
        binNumPath9,
    ],
    emitterSetting,
    columnWidth: 68,
    columnHeight: 2300,
    particleTexturePath
}