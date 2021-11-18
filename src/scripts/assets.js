const baseImagePath = require('../assets/base-image.png');
const deltoidPath = require('../assets/deltoid.png');
const assets = {
    "baseImage": {
        name: "baseImage",
        path: baseImagePath,
        x: 0,
        y: 0,
        width: 253,
        height: 575
    },
    muscles: [{
            name: "deltoid",
            attributes: {},
            path: deltoidPath,
            x: 145,
            y: 141,
        },
    ]
};
export default assets;
