import { render, screen } from '@testing-library/react';
import DevicePicker from '../components/DevicePicker';
import { DeviceTypeEnum } from '../model/DeviceTypeEnum';
import { IBatteryDevice } from '../model/IBatteryDevice';
import { ITransformerDevice } from '../model/ITransformerDevice';
import MainPage from '../pages/main/MainPage';
import { calculateEstimates } from '../shared/Util';

test('App rendering test', () => {
	render(<MainPage />);
	const linkElement = screen.getByText(/Select site configuration/i);
	expect(linkElement).toBeInTheDocument();
});

test('DevicePicker Rendering', () => {
	const device: IBatteryDevice = {
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
		count: 10,
		image: {
			preview: '',
			thumb: '',
		},
	};
	render(<DevicePicker device={device} onChange={() => {}} />);
	const linkElement: HTMLInputElement = screen.getByTestId('number-input');
	expect(linkElement).toBeInTheDocument();
	expect(linkElement.value).toBe('10');
});

test('Estimate calculator test', () => {
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
			count: 10,
			image: {
				preview: '',
				thumb: '',
			},
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
			count: 5,
			image: {
				preview: '',
				thumb: '',
			},
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
      count: 4,
			image: {
				preview: '',
				thumb: '',
			},
    },
  ];

  const estimate = calculateEstimates(batteries, transformers);
	expect(estimate.cost).toBe(1640000);
	expect(estimate.energy).toBe(54);
});
