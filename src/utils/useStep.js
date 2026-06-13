import { useEffect, useState } from 'react';
import { sumObjectsByKey } from './functions';

const useStep = (data, allStepEls) => {
	const [step, setStep] = useState(1);

	const rt = sumObjectsByKey(...data.slice(step).map(d => d.duration));
	const rtMS = { m: (rt.h * 60) + rt.m + Math.floor(rt.s / 60), s: rt.s % 60 };

	const minuteText = rtMS.m ? (1 === rtMS.m ? '1 minute' : `${rtMS.m} minutes`) : '';
	const secondText = rtMS.s ? (1 === rtMS.s ? '1 second' : `${rtMS.s} seconds`) : 'Complete';

	const onSetStep = (changedStep) => {
		setStep(changedStep);

		allStepEls.forEach((stepEl, index) => {
			const elStep = index + 1;

			elStep === changedStep ? stepEl.classList.add('running') : stepEl.classList.remove('running');

			stepEl.style.transform = `translate3d(${elStep < changedStep ? '-110%' : elStep > changedStep ? '110%' : '0px'}, 0px, 0px)`;

			setTimeout(() => {
				stepEl.display = elStep === changedStep ? 'block' : 'none';
			}, 300);
		});
	};

	useEffect(() => {
		onSetStep(step);
	}, [allStepEls, data?.length]);

	return { step, onSetStep, minuteText, secondText }
}
export default useStep;