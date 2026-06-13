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

	const minuteText = 1 === rtMS.m ? '1 minute' : `${rtMS.m} minutes`;
	const secondText = 1 === rtMS.s ? '1 second' : `${rtMS.s} seconds`;
	const remainingText = `${minuteText} and ${secondText}`;

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