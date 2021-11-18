import { AssetType, MuscleAttributes } from './interfaces';

const baseImagePath = require('../assets/base-image.png');
const muscles = require('../assets/muscles.json');


const assets: AssetType = {
    baseImage: {
        name: "baseImage",
        path: baseImagePath,
    },
    muscles
};




export default assets;

