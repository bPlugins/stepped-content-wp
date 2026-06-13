<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

use STP\GetCSS;

$stpId				= wp_unique_id( 'stpStep-' );
$stpBackground		= $attributes['background'] ?? [ 'color' => '#fff' ];
$stpContentColor	= $attributes['contentColor'] ?? '#161616';
$stpIsTitle			= $attributes['isTitle'] ?? true;
$stpTitle			= $attributes['title'] ?? 'Step Title';
$stpStep			= $attributes['step'] ?? 1;

$stpStepCSS = "
	#$stpId .instructions{
		". GetCSS::getBackgroundCSS( $stpBackground ) ."
	}
	#$stpId .instructions .instructionTitle,
	#$stpId .instructions .instructionContent{
		color: $stpContentColor;
	}
";
?>
<div
	<?php echo get_block_wrapper_attributes( [ 'class' => 'stpStep' ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped internally by get_block_wrapper_attributes(). ?>
	id='<?php echo esc_attr( $stpId ); ?>'
>
	<style><?php echo esc_html( $stpStepCSS ); ?></style>

	<div class='instructions'>
		<?php if( $stpIsTitle ) { ?>
			<h2 class='instructionTitle'>
				<?php echo esc_html( $stpStep ); ?>. <?php echo esc_html( $stpTitle ); ?>
			</h2>
		<?php } else {} ?>

		<div class='instructionContent'>
			<?php echo wp_kses_post( $content ); ?>
		</div>
	</div>
</div>