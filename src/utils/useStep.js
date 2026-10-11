import { useEffect, useRef, useState } from 'react';
import { _n, __, sprintf } from '@wordpress/i18n';

import { sumObjectsByKey } from './functions';

// allStepEls: NodeList, or a function returning it (resolved on each call so the lookup always hits the live DOM)
const useStep = (data, allStepEls) => {
	const [step, setStep] = useState(1);
	const appliedRef = useRef({ step: 0, els: [] });

	const rt = sumObjectsByKey(...data.slice(step).map(d => d.duration));
	const rtMS = { m: (rt.h * 60) + rt.m + Math.floor(rt.s / 60), s: rt.s % 60 };

	/* translators: %d: Number of remaining minutes. */
	const minuteText = rtMS.m ? sprintf(_n('%d minute', '%d minutes', rtMS.m, 'stepped-content'), rtMS.m) : '';
	/* translators: %d: Number of remaining seconds. */
	const secondText = rtMS.s ? sprintf(_n('%d second', '%d seconds', rtMS.s, 'stepped-content'), rtMS.s) : __('Complete', 'stepped-content');

	const getStepEls = () => [...(('function' === typeof allStepEls ? allStepEls() : allStepEls) || [])];

	// Positions only go stale when the active step or the step elements (added, removed, reordered, remounted) change
	const isApplied = (stepEls, activeStep) => {
		const { step: appliedStep, els } = appliedRef.current;
		return activeStep === appliedStep && stepEls.length === els.length && stepEls.every((el, index) => el === els[index]);
	};

	const onSetStep = (changedStep) => {
		setStep(changedStep);

		const stepEls = getStepEls();

		// The editor scrolls a newly selected step into view, which shifts the overflow-hidden wrapper sideways
		const stepsWrapper = stepEls[0]?.closest('.stpSteps');
		if (stepsWrapper) {
			stepsWrapper.scrollLeft = 0;
		}

		stepEls.forEach((stepEl, index) => {
			const elStep = index + 1;

			elStep === changedStep ? stepEl.classList.add('running') : stepEl.classList.remove('running');

			stepEl.style.transform = `translate3d(${elStep < changedStep ? '-110%' : elStep > changedStep ? '110%' : '0px'}, 0px, 0px)`;
		});

		appliedRef.current = { step: changedStep, els: stepEls };
	};

	// Checked after every render (step blocks mount and move outside this component), but only touches the DOM when stale
	useEffect(() => {
		if (!isApplied(getStepEls(), step)) {
			onSetStep(step);
		}
	});

	return { step, onSetStep, minuteText, secondText }
}
export default useStep;