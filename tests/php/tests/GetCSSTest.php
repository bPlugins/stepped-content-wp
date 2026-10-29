<?php
/**
 * Tests for the GetCSS helper.
 *
 * @package STP
 */

use STP\GetCSS;

/**
 * GetCSS is pure string building, so these pin its edge cases.
 */
class GetCSSTest extends WP_UnitTestCase {

	public function test_isValidCSS_skips_empty_values() {
		$this->assertSame( '', GetCSS::isValidCSS( 'color', '' ) );
		$this->assertSame( '', GetCSS::isValidCSS( 'color', null ) );
		$this->assertSame( '', GetCSS::isValidCSS( 'color', false ) );
	}

	public function test_isValidCSS_keeps_zero() {
		$this->assertSame( 'margin: 0;', GetCSS::isValidCSS( 'margin', 0 ) );
		$this->assertSame( 'margin: 0;', GetCSS::isValidCSS( 'margin', '0' ) );
	}

	public function test_isValidCSS_formats_property() {
		$this->assertSame( 'background-color: #fff;', GetCSS::isValidCSS( 'background-color', '#fff' ) );
	}

	public function test_solid_background_is_the_default() {
		$this->assertSame( 'background: #123456;', GetCSS::getBackgroundCSS( [ 'color' => '#123456' ] ) );
		$this->assertSame( '', GetCSS::getBackgroundCSS( [] ), 'No colour, no rule' );
	}

	public function test_gradient_background() {
		$css = GetCSS::getBackgroundCSS( [ 'type' => 'gradient', 'gradient' => 'linear-gradient(red, blue)' ] );
		$this->assertSame( 'background: linear-gradient(red, blue);', $css );
	}

	public function test_gradient_falls_back_to_default_gradient() {
		$css = GetCSS::getBackgroundCSS( [ 'type' => 'gradient' ] );
		$this->assertStringStartsWith( 'background: linear-gradient(135deg', $css );
	}

	public function test_image_background() {
		$css = GetCSS::getBackgroundCSS(
			[
				'type'         => 'image',
				'image'        => [ 'url' => 'https://example.com/a.jpg' ],
				'overlayColor' => '#000',
				'size'         => 'cover',
			]
		);
		$this->assertStringContainsString( 'background: url(https://example.com/a.jpg);', $css );
		$this->assertStringContainsString( 'background-color: #000;', $css );
		$this->assertStringContainsString( 'background-position: center center;', $css );
		$this->assertStringContainsString( 'background-size: cover;', $css );
		$this->assertStringContainsString( 'background-blend-mode: overlay;', $css );
		$this->assertStringNotContainsString( 'background-repeat', $css, 'Empty values are dropped' );
	}

	public function test_disallowed_types_fall_back() {
		$bg = [ 'type' => 'gradient', 'gradient' => 'linear-gradient(red, blue)', 'color' => '#fff' ];
		$this->assertSame( 'background: #fff;', GetCSS::getBackgroundCSS( $bg, true, false ), 'Gradient disabled: solid colour is used' );
		$this->assertSame( '', GetCSS::getBackgroundCSS( $bg, false, false ), 'Everything disabled: nothing' );

		$img = [ 'type' => 'image', 'image' => [ 'url' => 'x.jpg' ], 'color' => '#abc' ];
		$this->assertSame( 'background: #abc;', GetCSS::getBackgroundCSS( $img, true, true, false ), 'Image disabled: solid colour is used' );
	}
}
