import { getBackgroundCSS, getColorsCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { layout = {}, navBGColor, titleColor, remainingTimeColor, stepsBG, menu = {}, buttons = {} } = attributes;
	const { height } = layout;
	const { themeColor = '#1a73e8', textColor = '#212121' } = menu;
	const { back = { content: 'text', text: 'Back', colors: { color: '#1a73e8', bg: '#fff' } }, next = { content: 'text', text: 'Next', colors: { color: '#fff', bg: '#1a73e8' } }, done = { text: 'Done', linkTab: '_self', colors: { color: '#fff', bg: '#1e8e3e' } } } = buttons;

	const mainSl = `#${id}`;
	const navSl = `${mainSl} .stpNav`;
	const menuSl = `${mainSl} .stpMenu`;
	const menuLiSl = `${menuSl} ol li`;
	const numberCountLiSl = `${menuSl} .numberCount li`;
	const controlsSl = `${mainSl} .stpStepsWrapper .sptStepsControls`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			margin-top: 0;
			margin-bottom: 0;
		}
		${mainSl} .${prefix}{
			height: ${height};
		}
		${navSl}{
			background: ${navBGColor};
		}
		${navSl} h2{
			color: ${titleColor};
		}
		${navSl} .remainingTime{
			color: ${remainingTimeColor};
		}
		${mainSl} .stpSection{
			${getBackgroundCSS(stepsBG)};
		}
		${menuSl}{
			width: 295px;
		}
		${menuLiSl} a{
			color: ${textColor.slice(0, 7)}aa;
		}
		${menuLiSl}.complete a, ${menuLiSl}.running a{
			color: ${textColor};
		}
		${numberCountLiSl}.complete a span::before, ${numberCountLiSl}.running a span::before{
			background-color: ${themeColor};
		}

		${controlsSl} .prevBtn{
			${getColorsCSS(back.colors)}
		}
		${controlsSl} .nextBtn{
			${getColorsCSS(next.colors)}
		}
		${controlsSl} .doneBtn{
			${getColorsCSS(done.colors)}
		}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;