
import pixi from 'pixi.js';

export interface MuscleAttributes {

}

export interface Muscle {
    graphic: pixi.Graphics,
    name: string,
    attributes?: MuscleAttributes
}

export interface MuscleDataJSON {
    geometry: number[],
    name: string,
    x: number,
    y: number,
}

export interface BaseImageAssetElement {
    name?: string;
    path: string,
}


export interface AssetType {
    baseImage: BaseImageAssetElement
    muscles: MuscleDataJSON[]
}