<?php
namespace STP\Admin;

if ( !defined( 'ABSPATH' ) ) { exit; }

/**
 * SubMenu class.
 * Configures the WordPress admin submenu page for the Stepped Content plugin dashboard.
 *
 * @package STP\Admin
 */
class SubMenu {
	/**
	 * Constructor.
	 * Registers the hook to add the admin submenu.
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'adminMenu' ] );
	}

	/**
	 * Registers the plugin's dashboard page under the tools menu.
	 *
	 * @return void
	 */
	public function adminMenu(){
		add_submenu_page(
			'tools.php',
			__('Stepped Content - bPlugins', 'stepped-content'),
			__('Stepped Content', 'stepped-content'),
			'manage_options',
			'stepped-content',
			[ \STPPlugin::class, 'renderDashboard' ]
		);
	}
}
new SubMenu();