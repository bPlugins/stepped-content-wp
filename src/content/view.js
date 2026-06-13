import { createRoot } from 'react-dom/client';

import './style.scss';
import useStep from '../utils/useStep';
import Style from './Components/Common/Style';
import SteppedContent from './Components/Common/SteppedContent';

document.addEventListener('DOMContentLoaded', () => {
	const stpContentEls = document.querySelectorAll('.wp-block-stp-content');
	stpContentEls.forEach(stpContentEl => {
		const { attributes, content } = JSON.parse(stpContentEl.dataset.props);

		createRoot(stpContentEl).render(<>
			<Style attributes={attributes} id={stpContentEl.id} />

			<RenderSteppedContent attributes={attributes} id={stpContentEl.id} content={content} />
		</>);

		stpContentEl?.removeAttribute('data-props');
	});
});

const RenderSteppedContent = ({ attributes, id, content }) => {
	const { data } = attributes;

	const allStepEls = document.querySelectorAll(`#${id} .stpSteps > div.stpStep`);

	const { step, onSetStep, minuteText, secondText } = useStep(data, allStepEls)

	return <SteppedContent attributes={attributes} useStep={{ step, onSetStep, minuteText, secondText }}>
		<div className='stpSteps' dangerouslySetInnerHTML={{ __html: content.replace(/\s+/g, ' ') }} />
	</SteppedContent>
}