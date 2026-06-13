import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, __experimentalNumberControl as NumberControl, ToggleControl } from '@wordpress/components';

import { Label, Background, ColorControl } from '../../../../../../bpl-tools/Components';

const Settings = ({ attributes, setAttributes }) => {
	const { duration, background, contentColor, isTitle, title } = attributes;

	return <InspectorControls>
		<PanelBody className='bPlPanelBody' title={__('Step Settings', 'stepped-content')}>
			<Label className='mb5'>{__('Duration:', 'stepped-content')}</Label>

			<PanelRow className='mt0 gap15'>
				<PanelRow className='mt0 gap5'>
					<Label className=''>{__('H:', 'stepped-content')}</Label>
					<NumberControl value={duration['h']} onChange={val => setAttributes({ duration: { ...duration, h: parseInt(val) || 0 } })} min={0} max={100} />
				</PanelRow>

				<PanelRow className='mt0 gap5'>
					<Label className=''>{__('M:', 'stepped-content')}</Label>
					<NumberControl value={duration['m']} onChange={val => setAttributes({ duration: { ...duration, m: parseInt(val) || 0 } })} min={0} max={60} />
				</PanelRow>

				<PanelRow className='mt0 gap5'>
					<Label className=''>{__('S:', 'stepped-content')}</Label>
					<NumberControl value={duration['s']} onChange={val => setAttributes({ duration: { ...duration, s: parseInt(val) || 0 } })} min={0} max={60} />
				</PanelRow>
			</PanelRow>
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Step Style', 'stepped-content')} initialOpen={false}>
			<Background label={__('Background:', 'stepped-content')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#fff' }} />

			<ColorControl label={__('Content Color:', 'stepped-content')} value={contentColor} onChange={val => setAttributes({ contentColor: val })} defaultColor='#161616' />
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Title Settings', 'stepped-content')} initialOpen={false}>
			<ToggleControl label={__('Show title', 'stepped-content')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

			{isTitle && <>
				<Label>{__('Title:', 'stepped-content')}</Label>
				<TextControl value={title} onChange={val => setAttributes({ title: val })} />
			</>}
		</PanelBody>
	</InspectorControls>;
};
export default Settings;