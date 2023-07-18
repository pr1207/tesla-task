import { fabric } from 'fabric';
import { MidSectionPreview, TopSectionPreview } from '../assets/images';
import { DeviceTypeEnum } from '../model/DeviceTypeEnum';
import { IBatteryDevice } from '../model/IBatteryDevice';
import { ITransformerDevice } from '../model/ITransformerDevice';

const maxWidth = 100; //ft
const verticalMargin = 5; //ft
const leftStart = 330;
export const defaultCanvasH = 800;
export const locale = 'en-US';

export const getUrl = (url: string) => {
	return `${process.env.REACT_APP_API_URL}${url}`;
}

export const calculateEstimates = (batteries: IBatteryDevice[], transformers: IBatteryDevice[]) => {
	return [...batteries, ...transformers].reduce(
		(acc, battery) => ({
			energy: acc.energy + battery.count * battery.energy,
			cost: acc.cost + battery.count * battery.cost,
		}),
		{
			energy: 0,
			cost: 0,
		}
	);
};

export async function loadImage(img: string) {
	return new Promise<fabric.Image>((resolve, _reject) => {
		fabric.Image.fromURL(img, function (img) {
			img.selectable = false;
			img.hasControls = false;
			img.hasControls = false;
			img.hoverCursor = "auto";
			img.objectCaching = true;
			resolve(img);
		});
	});
}

export function findFit(
	availSpace: number,
	deviceCounts: (IBatteryDevice | ITransformerDevice)[],
	type?: DeviceTypeEnum
) {
	return deviceCounts.find(
		(device) =>
			device.count > 0 &&
			device.dimensions.l <= availSpace &&
			(type ? device.type === type : true)
	);
}

export async function initBackground(canvas: fabric.Canvas) {
	const topSection = await loadImage(TopSectionPreview);
	let img = topSection.set({ left: 0, top: 0 }).scale(canvas.width! / topSection.width!);
	canvas.add(img);

	for (let i = 0; i < 50; i++) {
		const section = await loadImage(MidSectionPreview);
		section
			.set({ left: 0, top: img.getBoundingRect().top + img.getBoundingRect().height })
			.scale(canvas.width! / section.width!);
		canvas.add(section);
		img = section;
	}

	canvas.renderAll();
}

/**
 * This method draws device layout but it tries to fit single transfomer
 * after each sequence of four batteries. It always trys to fit as much
 * devices as possible within the limit of 100ft per row
 * @param canvas 
 * @param batteries 
 * @param transformers 
 */
export async function drawDevicesOrdered(
	canvas: fabric.Canvas,
	batteries: IBatteryDevice[],
	transformers: ITransformerDevice[]
) {
    //remove existing layout
	canvas.remove(...canvas.getObjects().filter((ob) => ob.data?.preview));

	const batteryCounts = [...batteries]
		.map((b) => ({...b}))
		.filter((b) => b.count > 0);

	const trafoCounts = [...transformers]
		.map((b) => ({...b}))
		.filter((b) => b.count > 0);

	//dimensions in ft
	let width = 0;
	let height = batteryCounts.length > 0 ? 10 : 0;
    //current position in pixels
	let left = leftStart;
	let top = 180;
	let bottom = 0;
	let batteryCount = 0;
	let rowWidthMax = 0;
	let type = DeviceTypeEnum.BATTERY;

	while (batteryCounts.length > 0 || trafoCounts.length > 0) {
		rowWidthMax = Math.max(width, rowWidthMax);
        //reset the counter for batteries before transformer is drawn
		if (batteryCount === 4) batteryCount = 0;
        //in case there are no batteries left try to render last transformer
		if (batteryCounts.length === 0 && type === DeviceTypeEnum.BATTERY) {
			type = DeviceTypeEnum.TRANSFORMER;
		}
        //calculate available space for next device
		const availSpace = maxWidth - width;
        //try to find any device that fits the space
		const device = findFit(availSpace, [...batteryCounts, ...trafoCounts], type);

        //if no device go to next row
		if (!device) {
			left = leftStart;
			top = bottom;
			width = 0;
			height += 10 + verticalMargin;
		} else {
            //load device image
			const img = await loadImage(getUrl(device.image.preview));
			img.set({ left, top }).scale(0.8).rotate(180);
			img.selectable = false;
			img.data = {
				preview: true,
			};
			canvas.add(img);

			const ftToPx = (img.getScaledWidth()/device.dimensions.l);
			left = left + img.getScaledWidth();
			bottom = top + img.getScaledHeight() + verticalMargin * ftToPx;
			width += device.dimensions.l;
			device.count--;

			if (device.count === 0) {
				if (type === DeviceTypeEnum.BATTERY)
					batteryCounts.splice(
						batteryCounts.findIndex((dev) => dev.id === device.id),
						1
					);
				else if (type === DeviceTypeEnum.TRANSFORMER)
					trafoCounts.splice(
						trafoCounts.findIndex((dev) => dev.id === device.id),
						1
					);
			}
			if (type === DeviceTypeEnum.BATTERY) batteryCount++;
			type = batteryCount === 4 ? DeviceTypeEnum.TRANSFORMER : DeviceTypeEnum.BATTERY;
		}
	}

	canvas.setHeight(Math.max(top + 50, defaultCanvasH));
	canvas.renderAll();

	return {
		width: rowWidthMax,
		height
	}
}

/**
 * In the task requirements it seems that horizontally stacking (until 100ft limit is hit) 
 * without taking care about transformer/battery ordering would be sufficient. This should be easy to implement
 * 
 * However, based on photos of existing or in-development Tesla energy sites it looks that 
 * Megapacks are grouped in up to 4 batteries followed by required number of transformers
 * 
 * This method doesn't care about ordering of battery/transformer
 */
export async function drawDevicesNoOrder(
	canvas: fabric.Canvas,
	batteries: IBatteryDevice[],
	transformers: ITransformerDevice[]
) {
	canvas.remove(...canvas.getObjects().filter((ob) => ob.data?.preview));
	let deviceCounts = [...batteries, ...transformers]
		.map((b) => ({
			...b,
		}))
		.filter((b) => b.count > 0);

	//dimensions in ft
	let width = 0;
	let height = deviceCounts.length > 0 ? 10 : 0;
    //dimensions in px
	let left = leftStart;
	let top = 180;
	let bottom = 0;
	let rowWidthMax = 0;

	while (deviceCounts.length > 0) {
		rowWidthMax = Math.max(width, rowWidthMax);
		const availSpace = maxWidth - width;
		const device = findFit(availSpace, deviceCounts);

		if (!device) {
			left = leftStart;
			top = bottom;
			width = 0;
			height += 10 + verticalMargin;
		} else {
			const img = await loadImage(device.image.preview);
			img.set({ left, top }).scale(0.8).rotate(180);
			img.selectable = false;
			img.data = {
				preview: true,
			};
			canvas.add(img);

			const ftToPx = (img.getScaledWidth()/device.dimensions.l);

			left = left + img.getScaledWidth();
			bottom = top + img.getScaledHeight() + verticalMargin * ftToPx;
			width += device.dimensions.l;
			device.count--;
			if (device.count === 0) {
				deviceCounts.splice(
					deviceCounts.findIndex((dev) => dev.id === device.id),
					1
				);
			}
		}
	}

	canvas.setHeight(Math.max(top + 50, defaultCanvasH));
	canvas.renderAll();

	return {
		width: rowWidthMax,
		height
	}
}
