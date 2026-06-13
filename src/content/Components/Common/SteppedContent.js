import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import { clockIcon, menuIcon, closeIcon } from '../../../utils/icons';
import { getButtonContent } from '../../../utils/functions';

const SteppedContent = ({ attributes, useStep, children }) => {
	const { data, title, buttons = {}, isDoneBtn, doneBtnLink } = attributes;
	const { back = { content: 'text', text: 'Back', colors: { color: '#1a73e8', bg: '#fff' } }, next = { content: 'text', text: 'Next', colors: { color: '#fff', bg: '#1a73e8' } }, done = { text: 'Done', linkTab: '_self', colors: { color: '#fff', bg: '#1e8e3e' } } } = buttons;

	const { step, onSetStep, minuteText, secondText } = useStep;

	const [mobileMenuActive, setMobileMenuActive] = useState('');

	const remainingText = minuteText ? `${minuteText} and ${secondText}` : secondText;

	return <div className='stpContent'>
		<nav className='stpNav'>
			{mobileMenuActive ? <a className='menuClose' title={__('Close Menu', 'stepped-content')} onClick={e => {
				e.preventDefault();
				setMobileMenuActive('');
			}}>{closeIcon}</a> : <a className='menuOpen' title={__('Open Menu', 'stepped-content')} onClick={e => {
				e.preventDefault();
				setMobileMenuActive('active');
			}}>{menuIcon}</a>}

			<h2>{title}</h2>

			<div className='remainingTime'>
				{clockIcon}
				{remainingText}
			</div>
		</nav>

		<div className='stpSection' onClick={() => setMobileMenuActive('')}>
			<nav className={`stpMenu ${mobileMenuActive}`}>
				<ol className='numberCount'>
					{data.length ? data.map((d) => <li key={d.step} className={d.step === step ? 'running' : d.step < step ? 'complete' : ''} onClick={() => onSetStep(d.step)}>
						<a>
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