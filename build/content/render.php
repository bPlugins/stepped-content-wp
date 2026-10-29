<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

$stpId = wp_unique_id( 'stpContent-' );
?>
<div
	<?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped internally by get_block_wrapper_attributes(). ?>
	id='<?php echo esc_attr( $stpId ); ?>'
	data-props='<?php echo esc_attr( wp_json_encode( [ 'attributes' => $attributes, 'content' => $content ] ) ); ?>'
></div>