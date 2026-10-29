<?php
/**
 * Block registration and server-side rendering.
 *
 * @package STP
 */

/**
 * Both blocks render through PHP, so this is where output escaping is pinned.
 */
class BlocksTest extends WP_UnitTestCase {

	const CONTENT = '<!-- wp:stp/content --><!-- wp:stp/step {"title":"First"} --><!-- wp:paragraph --><p>hello</p><!-- /wp:paragraph --><!-- /wp:stp/step --><!-- /wp:stp/content -->';

	public function test_blocks_are_registered() {
		$registry = WP_Block_Type_Registry::get_instance();

		$content = $registry->get_registered( 'stp/content' );
		$step    = $registry->get_registered( 'stp/step' );

		$this->assertInstanceOf( WP_Block_Type::class, $content );
		$this->assertInstanceOf( WP_Block_Type::class, $step );
		$this->assertTrue( $content->is_dynamic(), 'stp/content renders through render.php' );
		$this->assertTrue( $step->is_dynamic(), 'stp/step renders through render.php' );
		$this->assertSame( [ 'stp/content' ], $step->parent, 'A step only lives inside stepped content' );
	}

	public function test_editor_and_view_scripts() {
		$this->assertTrue( wp_script_is( 'stp-content-editor-script', 'registered' ) );
		$this->assertTrue( wp_script_is( 'stp-content-view-script', 'registered' ) );
		$this->assertFalse( wp_script_is( 'stp-step-editor-script', 'registered' ), 'The step editor script is deregistered: the content bundle already contains it' );
	}

	public function test_content_block_renders_wrapper_with_props() {
		$html = do_blocks( self::CONTENT );

		$this->assertStringContainsString( 'wp-block-stp-content', $html );
		$this->assertMatchesRegularExpression( "/id='stpContent-\d+'/", $html );

		$this->assertSame( 1, preg_match( "/data-props='([^']*)'/", $html, $m ), 'data-props stays a single-line attribute' );
		$props = json_decode( html_entity_decode( $m[1], ENT_QUOTES ), true );

		$this->assertIsArray( $props );
		$this->assertArrayHasKey( 'attributes', $props );
		$this->assertArrayHasKey( 'content', $props );
		$this->assertStringContainsString( 'stpStep', $props['content'], 'The rendered steps travel inside the props' );
		$this->assertStringContainsString( '<p>hello</p>', $props['content'] );
	}

	public function test_step_block_renders_title_and_inner_content() {
		$html = do_blocks( '<!-- wp:stp/step {"title":"Setup","step":3} --><!-- wp:paragraph --><p>inner</p><!-- /wp:paragraph --><!-- /wp:stp/step -->' );

		$this->assertStringContainsString( 'stpStep', $html );
		$this->assertMatchesRegularExpression( '/<h2 class=\'instructionTitle\'>\s*3\. Setup\s*<\/h2>/', $html );
		$this->assertStringContainsString( '<p>inner</p>', $html );
	}

	public function test_step_title_is_escaped() {
		$html = do_blocks( '<!-- wp:stp/step {"title":"<b>Bold</b> & "q""} --><!-- /wp:stp/step -->' );

		$this->assertStringNotContainsString( '<b>Bold</b>', $html );
		$this->assertStringContainsString( '&lt;b&gt;Bold&lt;/b&gt; &amp; &quot;q&quot;', $html );
	}

	public function test_step_title_can_be_hidden() {
		$html = do_blocks( '<!-- wp:stp/step {"isTitle":false,"title":"Hidden"} --><!-- /wp:stp/step -->' );

		$this->assertStringNotContainsString( 'instructionTitle', $html );
		$this->assertStringNotContainsString( 'Hidden', $html );
	}

	public function test_step_colors_land_in_scoped_css() {
		$html = do_blocks( '<!-- wp:stp/step {"contentColor":"#ff0000","background":{"color":"#00ff00"}} --><!-- /wp:stp/step -->' );

		$this->assertSame( 1, preg_match( "/id='(stpStep-\d+)'/", $html, $m ) );
		$this->assertStringContainsString( '#' . $m[1] . ' .instructions', $html, 'CSS is scoped to this instance' );
		$this->assertStringContainsString( 'background: #00ff00;', $html );
		$this->assertStringContainsString( 'color: #ff0000;', $html );
	}
}
