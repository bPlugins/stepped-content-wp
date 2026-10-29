<?php
/**
 * Plugin bootstrap, admin page and the create-page URL filters.
 *
 * @package STP
 */

/**
 * The "Start" button on the dashboard opens post-new.php with title/content/nonce in the URL;
 * the default_title / default_content filters only honour that with a valid nonce.
 */
class PluginTest extends WP_UnitTestCase {

	public function tear_down() {
		unset( $_GET['title'], $_GET['content'], $_GET['nonce'] );
		parent::tear_down();
	}

	public function test_constants() {
		$this->assertTrue( defined( 'STP_VERSION' ) );
		$this->assertTrue( defined( 'STP_DIR_URL' ) );
		$this->assertTrue( defined( 'STP_DIR_PATH' ) );
		$this->assertFileExists( STP_DIR_PATH . 'index.php' );
		$this->assertFileExists( STP_DIR_PATH . 'build/content/block.json' );
	}

	public function test_version_header_matches_readme_stable_tag() {
		$header = get_file_data( STP_DIR_PATH . 'index.php', [ 'Version' => 'Version' ] )['Version'];
		$readme = file_get_contents( STP_DIR_PATH . 'readme.txt' );

		$this->assertSame( 1, preg_match( '/^Stable tag:\s*(\S+)/mi', $readme, $m ) );
		$this->assertSame( $m[1], $header );
	}

	public function test_default_content_ignored_without_nonce() {
		$page = self::factory()->post->create_and_get( [ 'post_type' => 'page' ] );

		$_GET['content'] = '<p>injected</p>';
		$this->assertSame( 'original', apply_filters( 'default_content', 'original', $page ) );

		$_GET['nonce'] = 'not-a-nonce';
		$this->assertSame( 'original', apply_filters( 'default_content', 'original', $page ) );
	}

	public function test_default_content_applied_with_nonce_and_kses() {
		$page = self::factory()->post->create_and_get( [ 'post_type' => 'page' ] );

		$_GET['nonce']   = wp_create_nonce( 'stpCreatePage' );
		$_GET['content'] = '<!-- wp:stp/content /--><p>ok</p><script>alert(1)</script>';

		$result = apply_filters( 'default_content', 'original', $page );

		$this->assertStringContainsString( '<!-- wp:stp/content /-->', $result );
		$this->assertStringContainsString( '<p>ok</p>', $result );
		$this->assertStringNotContainsString( '<script>', $result, 'wp_kses_post strips scripts' );
	}

	public function test_default_content_only_for_pages() {
		$post = self::factory()->post->create_and_get( [ 'post_type' => 'post' ] );

		$_GET['nonce']   = wp_create_nonce( 'stpCreatePage' );
		$_GET['content'] = '<p>page only</p>';

		$this->assertSame( 'original', apply_filters( 'default_content', 'original', $post ) );
	}

	public function test_default_title_with_nonce() {
		$page = self::factory()->post->create_and_get( [ 'post_type' => 'page' ] );

		$_GET['title'] = 'My <b>Guide</b>';
		$this->assertSame( '', apply_filters( 'default_title', '', $page ), 'No nonce: untouched' );

		$_GET['nonce'] = wp_create_nonce( 'stpCreatePage' );
		$this->assertSame( 'My Guide', apply_filters( 'default_title', '', $page ), 'Valid nonce: sanitised title' );
	}

	public function test_plugin_action_link() {
		$basename = plugin_basename( STP_DIR_PATH . 'index.php' );
		$links    = apply_filters( 'plugin_action_links', [], $basename );

		$this->assertArrayHasKey( 'help-and-demos', $links );
		$this->assertStringContainsString( 'page=stepped-content', $links['help-and-demos'] );
		$this->assertSame( [], apply_filters( 'plugin_action_links', [], 'other/other.php' ), 'Only this plugin gets the link' );
	}

	public function test_tools_submenu_for_admins() {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		global $submenu;
		$submenu = [];
		do_action( 'admin_menu' );

		$slugs = array_column( $submenu['tools.php'] ?? [], 2 );
		$this->assertContains( 'stepped-content', $slugs, 'Dashboard lives under Tools' );
	}
}
