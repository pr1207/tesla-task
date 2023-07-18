import { useCallback, useEffect, useState } from 'react';
import { TeslaLogo } from '../../assets/images';
import DevicePicker from '../../components/DevicePicker';
import { Estimate } from '../../model/Estimate';
import { IBatteryDevice } from '../../model/IBatteryDevice';
import LayoutPreview from '../../components/LayoutPreview';
import { ITransformerDevice } from '../../model/ITransformerDevice';
import { locale } from '../../shared/Util';
import { api } from '../../api/api';

export default function MainPage() {
	const [batteries, setBatteries] = useState<IBatteryDevice[]>([]);
	//stored in an array - in case more transformer models are supported later
	const [transformers, setTransformers] = useState<ITransformerDevice[]>([]);
	const [estimates, setEstimates] = useState<Estimate>(new Estimate());

	const getData = useCallback(async () => {
		setBatteries((await api.batteries.getAll()).map(bat => ({...bat, count: 0})));
		setTransformers((await api.transformers.getAll()).map(tr => ({...tr, count: 0})));
	}, [setBatteries, setTransformers]);

	useEffect(() => {
		getData();
	}, [getData])

	const handleCountChange = (battery: IBatteryDevice) => {
		const bts = [...batteries];
		bts.splice(
			bts.findIndex((b) => b.id === battery.id),
			1,
			battery
		);
		const count = bts.reduce((acc, battery) => (acc = acc + battery.count), 0);
		//since there is only one transformer model now always use it
		//this will have to be modified in case more transformer models are added
		setTransformers([{ ...transformers[0], count: Math.ceil(count / 4) }]);
		setBatteries(bts);
	};

	return (
		<div className='main-page'>
			<div className='left-panel'>
				<div className='device-list'>
					<img src={TeslaLogo} alt='Tesla logo' className='main-logo' />
					<p>
						Select site configuration to get energy density, cost and required land
						estimate
					</p>
					{batteries.map((battery) => (
						<DevicePicker
							key={battery.id}
							device={battery}
							onChange={handleCountChange}
						/>
					))}
				</div>
				<div className='device-estimate'>
					<div>
						<p className='value'>{estimates.energy} MWh</p>
						<p className='name'>Energy density</p>
					</div>
					<div>
						<p className='value'>${estimates.cost.toLocaleString(locale)}</p>
						<p className='name'>Estimated price</p>
					</div>
					<div>
						<p className='value'>{estimates.land}</p>
						<p className='name'>Total space</p>
					</div>
				</div>
			</div>
			<div className='right-panel'>
				<LayoutPreview batteries={batteries} transformers={transformers} setEstimates={setEstimates} />
			</div>
		</div>
	);
}
