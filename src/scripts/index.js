import { Application } from 'pixi.js';
const app = new Application({
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
import Sketch from './sketch';
const sketch = new Sketch(app.screen.width, app.screen.height);
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
