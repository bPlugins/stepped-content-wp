import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import { ColorsControl, Notice } from '../../../../../../bpl-tools/Components';

const Buttons = ({ attributes, setAttributes, updateObj }) => {
	const { buttons = {}, isDoneBtn, doneBtnLink } = attributes;
	const { back = { content: 'text', text: 'Back', colors: { color: '#1a73e8', bg: '#fff' } }, next = { content: 'text', text: 'Next', colors: { color: '#fff', bg: '#1a73e8' } }, done = { text: 'Done', linkTab: '_self', colors: { color: '#fff', bg: '#1e8e3e' } } } = buttons;

	return <PanelBody className='bPlPanelBody' title={__('Buttons', 'stepped-content')} initialOpen={false}>
		<ColorsControl className='mt20' value={back.colors} onChange={val => updateObj('buttons', 'back', val, 'colors')} defaults={{ color: '#1a73e8', bg: '#fff' }} />


		<ColorsControl className='mt30' value={next.colors} onChange={val => updateObj('buttons', 'next', val, 'colors')} defaults={{ color: '#1a73e8', bg: '#fff' }} />


		<ToggleControl className='mt30' label={__('Show Done Button', 'stepped-content')} checked={isDoneBtn} onChange={val => setAttributes({ isDoneBtn: val })} />

		<TextControl className='mt20' label={__('Done Button Link:', 'stepped-content')} value={doneBtnLink} onChange={val => setAttributes({ doneBtnLink: val })} />

		<ColorsControl className='mt20' value={done.colors} onChange={val => updateObj('buttons', 'done', val, 'colors')} defaults={{ color: '#1a73e8', bg: '#fff' }} />

		<Notice status='premium' isIcon={true}>{__('Unlock custom back, next, done button content and link target options with Premium version.', 'stepped-content')}</Notice>
	</PanelBody>
}
export default Buttons;