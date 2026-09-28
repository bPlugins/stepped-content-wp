import { useState, useEffect } from 'react';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import useIframeAssetSync from '../../../../../bpl-tools/hooks/useIframeAssetSync';
import { tabController } from '../../../../../bpl-tools/utils/functions';

import useStep from '../../../utils/useStep';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import SteppedContent from '../Common/SteppedContent';

const INNER_BLOCKS_TEMPLATE = [
	['stp/step', { title: 'Digital Marketing', duration: { h: 0, m: 4, s: 25 } }],
	['stp/step', { title: 'Wonders of Astrophysics', duration: { h: 0, m: 3, s: 0 } }],
	['stp/step', { title: 'Artificial Intelligence', duration: { h: 0, m: 2, s: 30 } }],
	['stp/step', { title: 'Sustainable Architecture', duration: { h: 0, m: 3, s: 25 } }]
];

const Edit = props => {
	const { attributes, setAttributes, isSelected, innerBlocks } = props;
	const { data } = attributes;
	const blockProps = useBlockProps();

	useIframeAssetSync(['stp-content-editor-style-css', 'stp-content-style-css']);

	useEffect(() => tabController(), [isSelected]);

	const childClients = innerBlocks.map(ib => ib.clientId);
	const [stepUpdateType, setStepUpdateType] = useState('')
	const [childClientIds, setChildClientIds] = useState(childClients);

	const id = blockProps.id;

	const allStepEls = document.querySelectorAll(`#${id} .stpSteps > .block-editor-inner-blocks > .block-editor-block-list__layout > div[data-type='stp/step']`);
	const { step, onSetStep, minuteText, secondText } = useStep(data, allStepEls);

	const innerBlocksData = JSON.stringify(
		innerBlocks.map(ib => ({ clientId: ib.clientId, title: ib.attributes.title, duration: ib.attributes.duration }))
	);

	useEffect(() => {
		const newData = innerBlocks.map((ib, index) => ({ step: index + 1, title: ib.attributes.title, duration: ib.attributes.duration }));

		setAttributes({ data: newData });
	}, [innerBlocksData]);

	useEffect(() => {
		if (childClients.length > childClientIds.length) {
			setStepUpdateType('add');
		} else if (childClients.length < childClientIds.length) {
			setStepUpdateType('delete');
		}

		setChildClientIds(childClients);
	}, [childClients?.length]);

	useEffect(() => {
		switch (stepUpdateType) {
			case 'add':
				onSetStep(data.length)
				break;
			case 'delete':
				onSetStep(step - 1)
				break;
			default:
				onSetStep(step);
				break;
		}
		setStepUpdateType('')
	}, [stepUpdateType]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...blockProps} id={id}>
			<Style attributes={attributes} id={id} />

			<SteppedContent attributes={attributes} useStep={{ step, onSetStep, minuteText, secondText }}>
				<div className='stpSteps'>
					<InnerBlocks allowedBlocks={['stp/step']} template={INNER_BLOCKS_TEMPLATE} renderAppender={InnerBlocks.ButtonBlockAppender} />
				</div>
			</SteppedContent>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const { getBlocks } = select('core/block-editor');

		return {
			innerBlocks: getBlocks(clientId)
		};
	}),

	withDispatch((dispatch) => {
		return {
			updateAttributes: (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args)
		}
	})
)(Edit);