<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'stp_fs' ) ) {
	/**
	 * Freemius SDK integration function (Lite version).
	 * Initializes and/or retrieves the global Freemius instance.
	 *
	 * @global object $stp_fs
	 * @return object The Freemius instance.
	 */
	function stp_fs() {
		global $stp_fs;

		if ( !isset( $stp_fs ) ) {
			require_once STP_DIR_PATH . '/vendor/freemius-lite/start.php';

			$stp_fs = fs_lite_dynamic_init( [
				'id'					=> '15887',
				'slug'					=> 'stepped-content',
				'__FILE__'				=> STP_DIR_PATH . 'index.php',
				'premium_slug'			=> 'stepped-content-pro',
				'type'					=> 'plugin',
				'public_key'			=> 'pk_1ed890cdff6977232e0948f5f2ea8',
				'is_premium'			=> false,
				'menu'					=> [
					'slug'			=> 'stepped-content',
					'first-path'	=> 'tools.php?page=stepped-content',
					'parent'		=> [
						'slug'	=> 'tools.php'
					]
				]
			] );
		}

		return $stp_fs;
	}

	stp_fs();
	do_action( 'stp_fs_loaded' );
}
