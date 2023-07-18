import { Request, Response, NextFunction } from 'express';
import { DeviceTypeEnum } from '../model/DeviceTypeEnum';
import { IBatteryDevice } from '../model/IBatteryDevice';
import { ITransformerDevice } from '../model/ITransformerDevice';

// Normally these images would be hosted on some kind of storage (eg. s3) or cdn
// and these urls would reflect that instead of being hosted as statics in a Node 
const images = {
    MegaPack2XL: {
		thumb: '/images/mp2xl.png',
		preview: '/images/mp2xl-preview.png'
	},
	MegaPack2: {
		thumb: '/images/mp2.png',
		preview: '/images/mp2-preview.png'
	},
	MegaPack: {
		thumb: '/images/mp.png',
		preview: '/images/mp-preview.png'
	},
	PowerPack: {
		thumb: '/images/pp.png',
		preview: '/images/pp-preview.png'
	},
	Transformer: {
		thumb: '/images/tf.png',
		preview: '/images/tf-preview.png'
	}
}

//This data would normally be fetched from some kind of SQL DB table 
//Table would have columns : ID, Type, ImageThumb, ImagePreview, Name, DimL, DimW, Energy, Cost, ReleaseDate
const batteries: IBatteryDevice[] = [
	{
		id: 1,
		name: 'Megapack 2XL',
		dimensions: {
			l: 40,
			w: 10,
		},
		energy: 4,
		cost: 120000,
		releaseDate: 2022,
		type: DeviceTypeEnum.BATTERY,
		image: images.MegaPack2XL,
	},
	{
		id: 2,
		name: 'Megapack 2',
		dimensions: {
			l: 30,
			w: 10,
		},
		energy: 3,
		cost: 80000,
		releaseDate: 2021,
		type: DeviceTypeEnum.BATTERY,
		image: images.MegaPack2,
	},
	{
		id: 3,
		name: 'Megapack',
		dimensions: {
			l: 30,
			w: 10,
		},
		energy: 2,
		cost: 50000,
		releaseDate: 2005,
		type: DeviceTypeEnum.BATTERY,
		image: images.MegaPack,
	},
	{
		id: 4,
		name: 'Powerpack',
		dimensions: {
			l: 10,
			w: 10,
		},
		energy: 1,
		cost: 20000,
		releaseDate: 2000,
		type: DeviceTypeEnum.BATTERY,
		image: images.PowerPack,
	},
];

const transformers: ITransformerDevice[] = [
	{
		id: 5,
		name: 'Transformer',
		dimensions: {
			l: 10,
			w: 10,
		},
		energy: -0.25,
		cost: 10000,
		type: DeviceTypeEnum.TRANSFORMER,
		image: images.Transformer,
	},
];

// getting all battery devices
const getBatteries = async (req: Request, res: Response, next: NextFunction) => {
	return res.status(200).json(batteries);
};

// getting all transformer devices
const getTransformers = async (req: Request, res: Response, next: NextFunction) => {
	return res.status(200).json(transformers);
};

export default { getBatteries, getTransformers };