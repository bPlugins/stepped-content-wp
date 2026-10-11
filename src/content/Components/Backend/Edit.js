import { useState, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
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
	['stp/step', { title: __('Digital Marketing', 'stepped-content'), duration: { h: 0, m: 4, s: 25 } }],
	['stp/step', { title: __('Wonders of Astrophysics', 'stepped-content'), duration: { h: 0, m: 3, s: 0 } }],
	['stp/step', { title: __('Artificial Intelligence', 'stepped-content'), duration: { h: 0, m: 2, s: 30 } }],
	['stp/step', { title: __('Sustainable Architecture', 'stepped-content'), duration: { h: 0, m: 3, s: 25 } }]
];

// Lets the appender, "Add before/after" and Enter insert a step directly (paragraphs aren't allowed here)
const DEFAULT_BLOCK = { name: 'stp/step' };

const Edit = props => {
	const { attributes, setAttributes, isSelected, innerBlocks, selectedStepIndex } = props;
	const { data } = attributes;
	const ref = useRef();
	const stepsRef = useRef();
	const blockProps = useBlockProps({ ref });

	useIframeAssetSync(['stp-content-editor-style-css', 'stp-content-style-css']);

	useEffect(() => tabController(), [isSelected]);

	const childClients = innerBlocks.map(ib => ib.clientId);
	const [stepUpdateType, setStepUpdateType] = useState('')
	const [childClientIds, setChildClientIds] = useState(childClients);

	const id = blockProps.id;

	// Query through the block's own node: the editor canvas is an iframe, so the global document doesn't contain it
	const getStepEls = () => ref.current?.querySelectorAll(".stpSteps > .block-editor-inner-blocks > .block-editor-block-list__layout > div[data-type='stp/step']");
	const { step, onSetStep, minuteText, secondText } = useStep(data, getStepEls);

	const innerBlocksData = JSON.stringify(
		innerBlocks.map(ib => ({ clientId: ib.clientId, title: ib.attributes.title, duration: ib.attributes.duration }))
	);

	useEffect(() => {
		const newData = innerBlocks.map((ib, index) => ({ step: index + 1, title: ib.attributes.title, duration: ib.attributes.duration }));

		setAttributes({ data: newData });
	}, [innerBlocksData]);

	useEffect(() => {
		if (childClients.length > childClientIds.length) {
			// Filling an empty block (template insert) isn't a user-added step, so stay on step 1
			setStepUpdateType(childClientIds.length ? 'add' : '');
		} else if (childClients.length < childClientIds.length) {
			setStepUpdateType('delete');
		}

		setChildClientIds(childClients);
	}, [childClients?.length]);

	useEffect(() => {
		// A step selected after the change (the inserted one, or the one selected before a deletion) wins over position guesses
		const selectedStep = -1 < selectedStepIndex ? selectedStepIndex + 1 : 0;

		switch (stepUpdateType) {
			case 'add':
				onSetStep(selectedStep || childClients.length)
				break;
			case 'delete':
				onSetStep(selectedStep || Math.max(step - 1, 1))
				break;
			default:
				onSetStep(step);
				break;
		}
		setStepUpdateType('')
	}, [stepUpdateType]);

	// Selecting a step (or anything inside it) from List View, breadcrumbs or keyboard shows that step
	useEffect(() => {
		if (-1 < selectedStepIndex && step !== selectedStepIndex + 1) {
			onSetStep(selectedStepIndex + 1);
		}
	}, [selectedStepIndex]);

	// Steps slide with transforms; the editor scrolling a hidden step into view would shift the overflow-hidden wrapper sideways
	useEffect(() => {
		const stepsEl = stepsRef.current;
		if (!stepsEl) {
			return;
		}

		const resetScroll = () => {
			if (stepsEl.scrollLeft) {
				stepsEl.scrollLeft = 0;
			}
		};

		stepsEl.addEventListener('scroll', resetScroll);
		return () => stepsEl.removeEventListener('scroll', resetScroll);
	}, []);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...blockProps} id={id}>
			<Style attributes={attributes} id={id} />

			<SteppedContent attributes={attributes} useStep={{ step, onSetStep, minuteText, secondText }}>
				<div className='stpSteps' ref={stepsRef}>
					<InnerBlocks allowedBlocks={['stp/step']} template={INNER_BLOCKS_TEMPLATE} defaultBlock={DEFAULT_BLOCK} directInsert renderAppender={InnerBlocks.ButtonBlockAppender} />
				</div>
			</SteppedContent>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const { getBlocks, getBlockOrder, getSelectedBlockClientId, getBlockParents } = select('core/block-editor');

		// Index of the step that holds the current selection, -1 when the selection is outside this block's steps
		const selectedId = getSelectedBlockClientId();
		const stepIds = getBlockOrder(clientId);
		const selectedStepId = selectedId ? [selectedId, ...getBlockParents(selectedId, true)].find(blockId => stepIds.includes(blockId)) : null;

		return {
			innerBlocks: getBlocks(clientId),
			selectedStepIndex: selectedStepId ? stepIds.indexOf(selectedStepId) : -1
		};
	}),

	withDispatch((dispatch) => {
		return {
			updateAttributes: (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args)
		}
	})
)(Edit);