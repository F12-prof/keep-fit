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
