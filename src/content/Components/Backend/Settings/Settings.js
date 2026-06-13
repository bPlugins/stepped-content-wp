import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Background, ColorControl, HelpPanel, BBlocksAds, HexColorControl, Notice } from '../../../../../../bpl-tools/Components';
import { AdvertiseCard } from '../../../../../../bpl-tools/ProControls';
import { emUnit, pxUnit, vhUnit } from '../../../../../../bpl-tools/utils/options';

import Buttons from './Buttons';
import { pricingUrl } from '../../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
	const { layout = {}, navBGColor, title, titleColor, remainingTimeColor, stepsBG, menu = {} } = attributes;
	const { themeColor = '#1a73e8', textColor = '#212121' } = menu;

	const updateObj = (obj, key, val, childKey = null) => {
		const newObj = produce(attributes[obj], draft => {
			if (null !== childKey) {
				draft[key][childKey] = val;
			} else {
				draft[key] = val;
			}
		});
		setAttributes({ [obj]: newObj });
	}

	return <>
		<InspectorControls>
			<div className='bPlInspectorInfo'>
				<BBlocksAds />
			</div>

			<HelpPanel slug='stepped-content' docsLink='https://bblockswp.com/docs/stepped-content-block' />


			<PanelBody className='bPlPanelBody' title={__('Layout', 'stepped-content')}>
				<UnitControl label={__('Height:', 'stepped-content')} labelPosition='left' value={layout.height} onChange={val => setAttributes({ layout: { ...layout, height: val } })} units={[pxUnit(800), vhUnit(100), emUnit(50)]} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Navbar', 'stepped-content')}>
				<ColorControl label={__('Background Color:', 'stepped-content')} value={navBGColor} onChange={val => setAttributes({ navBGColor: val })} defaultColor='#fff' />

				<Label>{__('Title:', 'stepped-content')}</Label>
				<TextControl value={title} onChange={val => setAttributes({ title: val })} />

				<ColorControl label={__('Title Color:', 'stepped-content')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#3c4043' />

				<ColorControl label={__('Remaining Time Color:', 'stepped-content')} value={remainingTimeColor} onChange={val => setAttributes({ remainingTimeColor: val })} defaultColor='#3c4043' />

				<Notice status='premium' isIcon={true}>{__('Unlock show/hide navigation bar and other options with Premium version.', 'stepped-content')}</Notice>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Menu/Sidebar', 'stepped-content')} initialOpen={false}>
				<ColorControl label={__('Theme Color:', 'stepped-content')} value={themeColor} onChange={val => setAttributes({ menu: { ...menu, themeColor: val } })} defaultColor='#1a73e8' />

				<HexColorControl label={__('Text Color:', 'stepped-content')} value={textColor} onChange={val => setAttributes({ menu: { ...menu, textColor: val } })} defaultColor='#212121' />

				<Notice status='premium' isIcon={true}>{__('Unlock different layout themes for the sidebar with Premium version.', 'stepped-content')}</Notice>
			</PanelBody>


			<Buttons attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />


			<PanelBody className='bPlPanelBody' title={__('Steps', 'stepped-content')} initialOpen={false}>
				<Background label={__('Background:', 'stepped-content')} value={stepsBG} onChange={val => setAttributes({ stepsBG: val })} />
			</PanelBody>


			<AdvertiseCard planLink={pricingUrl} />
		</InspectorControls>
	</>
};
export default Settings;