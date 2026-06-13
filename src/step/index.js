import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { stepPageIcon } from '../utils/icons';

registerBlockType(metadata, {
	icon: stepPageIcon,

	edit: Edit,

	save: () => <InnerBlocks.Content />
});