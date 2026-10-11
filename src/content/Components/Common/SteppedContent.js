import { useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';

import { clockIcon, menuIcon, closeIcon } from '../../../utils/icons';
import { getButtonContent, onSpaceKey } from '../../../utils/functions';

const SteppedContent = ({ attributes, useStep, children }) => {
	const { data, title, buttons = {}, isDoneBtn, doneBtnLink } = attributes;
	const { back = { content: 'text', text: __('Back', 'stepped-content'), colors: { color: '#1a73e8', bg: '#fff' } }, next = { content: 'text', text: __('Next', 'stepped-content'), colors: { color: '#fff', bg: '#1a73e8' } }, done = { text: __('Done', 'stepped-content'), linkTab: '_self', colors: { color: '#fff', bg: '#1e8e3e' } } } = buttons;

	const { step, onSetStep, minuteText, secondText } = useStep;

	const [mobileMenuActive, setMobileMenuActive] = useState('');

	const remainingText = minuteText ? sprintf(
		/* translators: 1: Remaining minutes (e.g. "2 minutes"), 2: Remaining seconds (e.g. "30 seconds"). */
		__('%1$s and %2$s', 'stepped-content'),
		minuteText,
		secondText
	) : secondText;

	return <div className='stpContent'>
		<nav className='stpNav'>
			{mobileMenuActive ? <a href='#' role='button' aria-expanded='true' className='menuClose' title={__('Close Menu', 'stepped-content')} aria-label={__('Close Menu', 'stepped-content')} onClick={e => {
				e.preventDefault();
				setMobileMenuActive('');
			}} onKeyDown={e => onSpaceKey(e, () => setMobileMenuActive(''))}>{closeIcon}</a> : <a href='#' role='button' aria-expanded='false' className='menuOpen' title={__('Open Menu', 'stepped-content')} aria-label={__('Open Menu', 'stepped-content')} onClick={e => {
				e.preventDefault();
				setMobileMenuActive('active');
			}} onKeyDown={e => onSpaceKey(e, () => setMobileMenuActive('active'))}>{menuIcon}</a>}

			<h2>{title}</h2>

			<div className='remainingTime'>
				{clockIcon}
				{remainingText}
			</div>
		</nav>

		<div className='stpSection' onClick={() => setMobileMenuActive('')}>
			<nav className={`stpMenu ${mobileMenuActive}`} aria-label={__('Steps', 'stepped-content')}>
				<ol className='numberCount'>
					{data.length ? data.map((d) => <li key={d.step} className={d.step === step ? 'running' : d.step < step ? 'complete' : ''}>
						<a href='#' role='button' aria-current={d.step === step ? 'step' : undefined} onClick={e => {
							e.preventDefault();
							onSetStep(d.step);
						}} onKeyDown={e => onSpaceKey(e, () => onSetStep(d.step))}>
							<span>{d.title}</span>
						</a>
					</li>) : <li><a>{__('Please add a step!', 'stepped-content')}</a></li>}
				</ol>

				{/* <+ */}
			</nav>

			<div className='stpStepsWrapper'>
				{children}

				<div className='sptStepsControls'>
					<div className='controlsInner'>
						{1 < step && <button className={`docControlBtn prevBtn ${back.content}`} title={__('Previous step', 'stepped-content')} onClick={() => onSetStep(step - 1)}>
							{getButtonContent(back, data[step - 2]?.title)}
						</button>}

						{step === data.length && isDoneBtn && <a href={doneBtnLink} target={done.linkTab} className='docControlBtn doneBtn' title={__('Document Complete', 'stepped-content')}>{done.text}</a>}

						{step < data.length && <button className={`docControlBtn nextBtn ${next.content}`} title={__('Next step', 'stepped-content')} onClick={() => onSetStep(step + 1)}>
							{getButtonContent(next, data[step]?.title)}
						</button>}
					</div>
				</div>
			</div> {/* Steps Wrapper */}
		</div>
	</div>
}
export default SteppedContent;