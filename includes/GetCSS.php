<?php
namespace STP;

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * GetCSS class.
 * Helper utility to generate dynamic CSS styles from Gutenberg block attributes.
 *
 * @package STP
 */
class GetCSS {
	/**
	 * Formats and validates a CSS property-value pair.
	 *
	 * @param string $property The CSS property name (e.g., 'background-color').
	 * @param string|int $value The CSS property value.
	 * @return string The formatted CSS property line, or empty string if value is empty.
	 */
	public static function isValidCSS( $property, $value ) {
		if ( empty( $value ) && '0' !== $value && 0 !== $value ) {
			return '';
		}
		return "$property: $value;";
	}

	/**
	 * Generates CSS rules for background settings based on attributes.
	 *
	 * @param array $bg Background attributes containing type, color, gradient, image, etc.
	 * @param bool $isSolid Whether solid background color is allowed. Default true.
	 * @param bool $isGradient Whether gradient background is allowed. Default true.
	 * @param bool $isImage Whether image background is allowed. Default true.
	 * @return string The generated background CSS styles.
	 */
	public static function getBackgroundCSS( $bg, $isSolid = true, $isGradient = true, $isImage = true ) {
		$type			= isset( $bg['type'] ) ? $bg['type'] : 'solid';
		$color			= isset( $bg['color'] ) ? $bg['color'] : '';
		$gradient		= isset( $bg['gradient'] ) ? $bg['gradient'] : 'linear-gradient(135deg, #0040E3, #18D4FD)';
		$image			= isset( $bg['image'] ) ? $bg['image'] : [];
		$position		= isset( $bg['position'] ) ? $bg['position'] : 'center center';
		$attachment		= isset( $bg['attachment'] ) ? $bg['attachment'] : '';
		$repeat			= isset( $bg['repeat'] ) ? $bg['repeat'] : '';
		$size			= isset( $bg['size'] ) ? $bg['size'] : '';
		$overlayColor	= isset( $bg['overlayColor'] ) ? $bg['overlayColor'] : '';

		if ( 'gradient' === $type && $isGradient ) {
			$styles = self::isValidCSS( 'background', $gradient );
		} elseif ( 'image' === $type && $isImage ) {
			$imgUrl = $image['url'] ?? '';
			$styles = "background: url($imgUrl);"
				. self::isValidCSS( 'background-color', $overlayColor )
				. self::isValidCSS( 'background-position', $position )
				. self::isValidCSS( 'background-size', $size )
				. self::isValidCSS( 'background-repeat', $repeat )
				. self::isValidCSS( 'background-attachment', $attachment )
				. 'background-blend-mode: overlay;';
		} else {
			$styles = $isSolid ? self::isValidCSS( 'background', $color ) : '';
		}

		return $styles;
	}
}
