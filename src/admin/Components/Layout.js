import { Outlet, Link, useLocation } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

import Header from '../../../../bpl-tools/Admin/Header';

const navigation = [
	{ name: __('Welcome', 'stepped-content'), href: '/welcome' },
	{ name: __('Demos', 'stepped-content'), href: '/demos' },
	{ name: __('Pricing', 'stepped-content'), href: '/pricing' },
	{ name: __('Feature Comparison', 'stepped-content'), href: '/feature-comparison' }
];

const Layout = (props) => {
	const location = useLocation();

	return <div className='bPlDashboard'>
		<Header {...props}>
			<nav className='bPlDashboardNav'>
				{navigation
					?.map((item, index) => <Link
						key={index}
						to={item.href}
						className={`navLink ${location.pathname === item.href ? 'active' : ''}`}
					>
						{item.name}
					</Link>)}
			</nav>
		</Header>

		<main className='bPlDashboardMain'>
			<Outlet />
		</main>
	</div>
}
export default Layout;