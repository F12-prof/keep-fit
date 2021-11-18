import { Application, Sprite, Graphics, Container, TextStyle, Text } from 'pixi.js'

const app = new Application({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 1024,
    height: 768
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

import Sketch from './sketch';

const sketch = new Sketch(app.screen.width, app.screen.height);

app.stage.addChild(sketch);

// bind input
const inputElement = document.getElementById('muscle-name') as HTMLInputElement;
inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
    sketch.setCurrentName(inputElement.value);
});

// download service
function downloadObjectAsJson(exportObj: any, exportName: string) {
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
    const outData:any = [];
    sketch.getDrawnObjects().forEach(elem => {
        const data = elem.graphic.geometry.graphicsData;
        data[0].fillStyle = null;
        data[0].lineStyle = null;
        outData.push({
            geometry: data,
            name: elem.name,
        });
    })
    downloadObjectAsJson(outData, "muscles");
    sketch.clearAllDrawnObjects();
})