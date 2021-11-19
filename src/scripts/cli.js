import { Container, Graphics, Ticker, Text, TextStyle } from "pixi.js";
const themeColor = 0x72B377;
export default class CLI extends Container {
    //-------------------------------
    //      Life Cycle
    //-------------------------------
    constructor(posX, posY, sceneWidth, sceneHeight, lineGap) {
        super();
        this.textStyle = new TextStyle({
            dropShadow: true,
            dropShadowAlpha: 0.6,
            dropShadowColor: "#b41d1d",
            fill: "#72b377",
            fontFamily: "Cascadia Code",
            fontSize: 15,
            letterSpacing: 2,
            lineJoin: "round",
            stroke: "#933939",
            wordWrap: true
        });
        // Data
        this.lines = [];
        this.lineTexts = [];
        //-------------------------------
        //      Animation
        //-------------------------------
        this.lineCursorFlickerPeriod = 60;
        this.animateRounds = 0;
        // setting context
        this.posX = posX;
        this.posY = posY;
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        // Calculate styles
        this.lineGap = lineGap;
        this.lineWithGapHeight = lineGap + this.textStyle.fontSize;
        this.maxLines = Math.floor(sceneHeight / this.lineWithGapHeight);
        this.textStyle.wordWrapWidth = sceneWidth;
        // setting position
        this.position.set(posX, posY);
        // create lineCursor
        const cursor = this.lineCursor = new Graphics();
        cursor.beginFill(themeColor);
        cursor.drawRect(0, 0, 10, this.textStyle.fontSize);
        cursor.endFill();
        this.addChild(cursor);
        cursor.position.set(posX, posY);
        // animate cursor
        Ticker.shared.add(this.onUpdateFrame.bind(this));
    }
    //-------------------------------
    //      Public Methods
    //-------------------------------
    clear() {
        this.lines = [];
        this.lineTexts.forEach(elem => {
            elem.destroy();
        });
        this.lineTexts = [];
    }
    append(line) {
        // Dealing with data
        this.lines.push(line);
        const newLine = new Text(line, this.textStyle);
        const newRowIdx = this.lineTexts.push(newLine) - 1;
        this.addChild(newLine);
        console.log("current lines:", this.lines.length);
        console.log('MaxLines:', this.maxLines);
        if (this.lines.length > this.maxLines) {
            this.lines.splice(0, 1);
            this.lineTexts[0].destroy();
            this.lineTexts.splice(0, 1);
            // move lines up
            this.lineTexts.forEach((line, index) => {
                line.position.y = this.getLinePosition(index);
            });
            newLine.position.y = this.getLinePosition(newRowIdx - 1);
        }
        else {
            newLine.position.y = this.getLinePosition(newRowIdx);
        }
        // moving cursor
        this.lineCursor.position.set(newLine.width, newLine.y);
        return this;
    }
    //-------------------------------
    //      Private Methods
    //-------------------------------
    getLinePosition(row) {
        return row * this.lineWithGapHeight;
    }
    onUpdateFrame(delta) {
        ++this.animateRounds;
        if (this.animateRounds == this.lineCursorFlickerPeriod) {
            this.lineCursor.visible = !this.lineCursor.visible;
            this.animateRounds = 0;
        }
    }
}
