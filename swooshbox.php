<?php
/**
 * Plugin Name: Swooshbox
 * Description: A slick and simple lightbox effect from the makers of <a href="http://www.roktopus.net">Roktopus themes</a>. Just install and activate &ndash; no setup needed.
 * Author: Roktopus Industries
 * Plugin URI: http://www.roktopus.net/swooshbox/
 * Author URI: http://www.roktopus.net
 * Version: 0.9.1.4
 * License: GPLv2
**/

function swooshbox_scripts() {
	wp_enqueue_script( 'swooshbox-core', plugin_dir_url( __FILE__ ) . 'swoosh.js', array( 'jquery', 'jquery-effects-core' ), '', true );
	wp_enqueue_style( 'swooshbox-css', plugin_dir_url( __FILE__ ) . 'swoosh.css');
}

add_action( 'wp_enqueue_scripts', 'swooshbox_scripts' );

require dirname(__FILE__) . '/options.php';

function swooshbox_data() {

	update_option('sliderscope', '');
	update_option('sb-minwidth', '0');

	echo '<script>' . 
		'var custom_sliderscope = "' . get_option('sliderscope') . '"; ' .
		'var sb_minwidth = ' . get_option('sb-minwidth') . '; ' .
		'var sidebuttontitle = "' .  __('You can also use the arrow keys') . '"; ' .
		'var linkables = "a[href$=\'.gif\'], a[href$=\'.jpg\'], a[href$=\'.jpeg\'], a[href$=\'.png\'], a[href$=\'.bmp\']"; ' . 
		'</script>';
}
add_action( 'wp_footer', 'swooshbox_data');