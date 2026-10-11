import { _n, __, sprintf } from '@wordpress/i18n';

import { arrowIcon } from './icons';

export const sumObjectsByKey = (...objs) => {
	return objs.reduce((a, b) => {
		for (let k in b) {
			if (Object.prototype.hasOwnProperty.call(b, k))
				a[k] = (a[k] || 0) + b[k];
		}
		return a;
	}, {});
}

export const getRemainingText = data => {
	const rt = sumObjectsByKey(...data.map(d => d.duration));
	const rtMS = { m: (rt.h * 60) + rt.m + Math.floor(rt.s / 60), s: rt.s % 60 };

	/* translators: %d: Number of remaining minutes. */
	const minuteText = sprintf(_n('%d minute', '%d minutes', rtMS.m, 'stepped-content'), rtMS.m);
	/* translators: %d: Number of remaining seconds. */
	const secondText = sprintf(_n('%d second', '%d seconds', rtMS.s, 'stepped-content'), rtMS.s);
	/* translators: 1: Remaining minutes (e.g. "2 minutes"), 2: Remaining seconds (e.g. "30 seconds"). */
	const remainingText = sprintf(__('%1$s and %2$s', 'stepped-content'), minuteText, secondText);

	return remainingText;
}

export const getButtonContent = (button, title = '') => {
	switch (button.content) {
		case 'icon':
			return arrowIcon;
		case 'title':
			return title;
		default:
			return button.text;
	}
}

// Links acting as buttons (role='button') must also activate on Space, like native buttons do
export const onSpaceKey = (e, callback) => {
	if (' ' === e.key) {
		e.preventDefault();
		callback();
	}
}