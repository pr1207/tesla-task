import { memo, useCallback, useEffect, useState } from "react";
import { fabric } from 'fabric';
import { IBatteryDevice } from "../model/IBatteryDevice";
import { ITransformerDevice } from "../model/ITransformerDevice";
import { calculateEstimates, drawDevicesNoOrder, drawDevicesOrdered, initBackground } from "../shared/Util";
import { Estimate } from "../model/Estimate";

/**
 * Props interface of LayoutPreview component
 * 
 * Accepts both @IBatteryDevice and @ITransformerDevice devices
 */
interface IProps {
    batteries: IBatteryDevice[];
    transformers: ITransformerDevice[];
    setEstimates(est: Estimate): void;
}

/** 
 * based on this enum we decide wether layout preview takes into account ordering of 
 * battery and transformer devices or not
 */

enum LayoutMode {
    DEFAULT,
    ORDERING
}

/**
 * Component that renders preview of layout in a canvas based on selected number of battery devices
 * @param IProps 
 */
function LayoutPreview({ batteries, transformers, setEstimates }: IProps) {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [mode, setMode] = useState<LayoutMode>(LayoutMode.DEFAULT);

    const initCanvas = useCallback(async () => {
        const canvas = new fabric.Canvas('canvas', {
            height: 800,
            width: 900,
            backgroundColor: 'white',
            selection: false
        });

        await initBackground(canvas);
        setCanvas(() => canvas);
    }, [setCanvas]);

    const drawPreview = useCallback(async () =>  {
        if(canvas) {
            const land = mode === LayoutMode.ORDERING
                ? await drawDevicesOrdered(canvas, batteries, transformers)
                : await drawDevicesNoOrder(canvas, batteries, transformers)
            setEstimates({
                ...calculateEstimates(batteries, transformers),
                land: `${land.height}ft x ${land.width}ft`
            })
        }
    }, [canvas, mode, batteries, transformers, setEstimates]);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    useEffect(() => {
        drawPreview();
    }, [drawPreview])

    return (
        <div className='layout-preview'>
            <canvas id="canvas" />
            <button className="btn-change-mode" onClick={() => {setMode(mode === LayoutMode.DEFAULT ? LayoutMode.ORDERING : LayoutMode.DEFAULT)}}>Change mode</button>
        </div>
    )
}

export default memo(LayoutPreview);