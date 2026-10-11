import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import App from './Components/App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.getElementById('stpDashboard');

	// Freemius opt-in/licence screens render on this page in place of the dashboard container
	if (!dashboardEl) {
		return;
	}

	const info = JSON.parse(dashboardEl.dataset.info);

	createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);

	dashboardEl.removeAttribute('data-info');
});