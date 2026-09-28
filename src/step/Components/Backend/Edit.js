import { useEffect } from 'react';
import { withSelect } from '@wordpress/data';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { getBackgroundCSS } from '../../../../../bpl-tools/utils/getCSS';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const STEP_TEMPLATE = [
	['core/heading', {
		content: 'The Renaissance of Artificial Intelligence.',
		style: {
			typography: { fontSize: '24px' }
		}
	}],

	['core/paragraph', {
		content: 'The resurgence of artificial intelligence (AI) has revolutionized industries worldwide, marking an era of unprecedented innovation. AI, driven by machine learning, neural networks, and deep learning algorithms, has permeated various domains, from healthcare and finance to entertainment and transportation. \n Its ability to process massive data sets, automate tasks, and mimic human cognition has led to transformative advancements. \n The quest for AI\'s potential knows no bounds, as scientists and technologists explore realms like autonomous vehicles, natural language processing, and personalized digital assistants.',
		style: {
			typography: { fontSize: '16px' }
		}
	}],

	// ['core/list',
	// 	{
	// 		values: '<li>At first insert the block like other blocks.</li><li>Select the block and you will see the right sidebar.</li><li>From the sidebar you can change the settings.</li><li>You can add new step by clicking circle plus icon at the very bottom.</li>',
	// 		className: 'checklist'
	// 	},

	// ],

	// ['core/preformatted', { className: 'pre', content: 'Enjoy the stepped content block!!' }]
];

const Edit = props => {
	const { attributes, setAttributes, currentStep } = props;
	const { background, contentColor, isTitle, title } = attributes;
	const blockProps = useBlockProps({ className: prefix });

	useEffect(() => {
		setAttributes({ step: currentStep });
	}, [currentStep]);

	const id = blockProps.id;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...blockProps} id={id}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#${id} .instructions{
					${getBackgroundCSS(background)}
				}
				#${id} .instructions .instructionTitle,
				#${id} .instructions .instructionContent{
					color: ${contentColor};
				}
				`.replace(/\s+/g, ' ')
			}} />

			<div className='instructions'>
				{isTitle && <h2 className='instructionTitle'>
					{currentStep}. {title}
				</h2>}

				<div className='instructionContent'>
					<InnerBlocks template={STEP_TEMPLATE} />
				</div>
			</div>
		</div>
	</>;
};
export default withSelect((select, props) => {
	const { clientId } = props;
	const { getBlockParents, getBlockIndex } = select('core/block-editor');

	const parentBlockId = getBlockParents(clientId)[0];

	return {
		currentStep: getBlockIndex(clientId, parentBlockId) + 1
	};
})(Edit);