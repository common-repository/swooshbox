( function( $ ) {

	var sliderscope = 'body';

	$(document).ready( function() {
		if ( $('article').length > 0 ) { sliderscope = 'article'; }
		if ( $(custom_sliderscope).length > 0 ) { sliderscope = custom_sliderscope; }
	});

	$(window).ready( function() {
		if ( window.screen.width > sb_minwidth ) {
			swooshbox();
			$(window).bind( 'resize', function() {
				resize_swooshbox();
			})
		}
	});

	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
	        $('.sidebutton.left').click();
	        break;

	        case 39: // right
	        $('.sidebutton.right').click();
	        break;

	        default: return; // exit this handler for other keys
	    }
	});

	$.fn.bigtarget = function () {
		$(this).find('.target').each( function() {
			var ds = $(this).attr('data-src');
			var s = $(this).attr('src');
			if (ds != s ) {
				$(this).attr('src', ds);
			}
		});
	}

	function swooshbox() {	
		$(linkables).each( function() {
			var href = $(this).attr('href');
			var thelink = $(this);
			var thesource = thelink.children('img');
			var thetitle = thesource.attr('title');
			var thecaption = '';
			if ( $(this).siblings('.wp-caption-text').length > 0 ) { thecaption = $(this).siblings('.wp-caption-text').text(); }
			if ( $(this).parent('dt').siblings('.wp-caption-text').length > 0 ) { thecaption = $(this).parent('dt').siblings('.wp-caption-text').text(); }
			if ( $(this).parent('.gallery-icon').siblings('.wp-caption-text').length > 0 ) { thecaption = $(this).parent('.gallery-icon').siblings('.wp-caption-text').text(); }
			if ( thesource.size() == 0 ) { thelink.append('<img class="dummy" src="">'); thesource = thelink.children('img.dummy'); }
			thelink
				.append('<img class="target" caption="' + thecaption + '" data-src="' + href +'" src="' + thesource.attr('src') + '" style="background-image: url(' + thesource.attr('src') + '); background-size: 100% 100%">')
				.addClass('lightboxready')
				.mouseenter( function() {
					$(this).bigtarget();
				})
				.click( function() {

					if ( thesource.width() > ( $(window).width() * 0.9 ) ) { return };

					if ( thelink.closest(sliderscope).find('.lightboxready').length == 1 ) {
						$('body')
							.append('<div class="lightbox"><div class="SBclose">X</div><div class="SBcaption hidden"></div></div>')
							.addClass('lightboxed');
					}
					else {
						$('body')
							.append('<div class="lightbox"><div class="SBclose">X</div><div class="sidebutton left" title="' + sidebuttontitle + '">&lsaquo;</div><div class="sidebutton right" title="' + sidebuttontitle + '">&rsaquo;</div><div class="SBcaption hidden"></div></div>')
							.addClass('lightboxed');
					}
					$('.SBclose').hover(
						function() { $('body').addClass('SBChover'); },
						function() { $('body').removeClass('SBChover'); }
					);

					thelink.addClass('lit').children('.target').clone().appendTo('.lightbox').removeClass('target').attr('title', thetitle);
					if ( $('.lightbox img').attr('caption') != '' )	{ 
						var captionin = setTimeout( function() {
							$('.SBcaption').text( $('.lightbox img').attr('caption') ).removeClass('hidden');
						}, 600);
					}

					$('.lightbox').click( function() {
						$('.lightbox').remove();
						$('.lit').removeClass('lit');
						$('body').removeClass('SBChover');
						if ( $('#part-x').length == 0 ) { $('body').removeClass('lightboxed'); }
						$('.selectable').removeClass('selectable');
					}).children('.sidebutton').click( function() {
							$('.lit').closest(sliderscope).find('.lightboxready').addClass('selectable');
							if ( $(this).hasClass('left') ) {
								var l = $('.lightbox img').offset().left + $(window).width();
								var n = $('.lit').index( '.selectable' ) - 1;
								var polarity = -1;
								var perc = '-93%'
							}
							if ( $(this).hasClass('right') ) {
								var l = $('.lightbox img').offset().left - $(window).width();
								var n = $('.lit').index( '.selectable' ) + 1;
								if ( n == $( '.selectable').length ) { n = 0; } // back to start
								var polarity = 1;
								var perc = '107%';
							}
							var eeze = 'easeOutQuint';  
							var speed = 700;
							$('.lightbox img').addClass('kill').removeClass('new').css({'transition': 'none', '-webkit-transition': 'none'}).animate({'left': l }, speed, eeze);
							var killimg = setTimeout( function() {
								$('.kill').eq(0).remove();
							}, 500);
							var lboxes = $('.lit').closest(sliderscope).find('.lightboxready');
							lboxes.eq(n).bigtarget();
							lboxes.eq(n-1).bigtarget();
							lboxes.eq(n+1).bigtarget();
							$('.lit').removeClass('lit').closest(sliderscope).find('.lightboxready').eq(n).addClass('lit').children('.target').clone().removeClass('target').appendTo('.lightbox').addClass('new');
							$('.SBcaption').text('').addClass('hidden');
							if ( $('img.new').attr('caption') != '' ) {
								var captionin = setTimeout( function() {
									$('.SBcaption').text( $('img.new').attr('caption') ).removeClass('hidden');
								}, 100);
							}

							var l = ( $(window).width() - ( 0.86 * $(window).height() * $('.lightbox img.new').width() / $('.lightbox img.new').height() ) ) / 2;						
							var rr = 'rotate(' + (( Math.random() * 2 ) - 1 ) + 'deg)';

							if ( ( $(window).width() / $(window).height() ) > ( $('.lightbox img.new').width() / $('.lightbox img.new').height() ) ) {
								$('.lightbox img.new').css( {
									'top': '7%',
									'left': l + ( $(window).width() * polarity),
									'height': '86%',
									'box-shadow': '0 10px 50px -20px #000',
									'transform': rr,
									'-webkit-transform': rr,
									'opacity': 1
								}).animate({
									'left': l
								}, speed, eeze);
							}
							else { // Superwide
								$('.lightbox img.new').css({
									'top': '7%', 
									'left': perc,
									'width': '86%',
									'box-shadow': '0 10px 50px -20px #000',
									'transform': rr,
									'-webkit-transform': rr,
									'opacity': 1
								});
								var h = ( $('.lightbox').height() - $('.lightbox img.new').height() ) / 2;
								$('.lightbox img.new').css('top', h).animate({
									'left': '7%'
								}, speed, eeze);
							}

							return false; // prevent bubbling
					});
					var x = thesource.offset().left;
					var y = thesource.offset().top - $(window).scrollTop();	
					var w = thesource.width();	
					var h = thesource.height();
					var t = thesource.css('transform');
					var bs = thesource.css('box-shadow');
					var mbh = $('.menubottom .menu').height();
					var p = thesource.css('padding');
					var b = thesource.css('border');
					if (mbh > 100 ) { mbh = 0 };
					if ( ( $(window).width() / $(window).height() ) > ( $('.lightbox img').width() / $('.lightbox img').height() ) ) {
						$('.lightbox img').css({
							'top': y,
							'left': x,
							'width': 'auto',
							'height': h,
							'transform': t,
							'-webkit-transform': t,
							'box-shadow': bs,
							'opacity': 1,
							'padding': p,
							'border': b
						});
						var l = ( $(window).width() - ( 0.86 * $(window).height() * $('.lightbox img').width() / $('.lightbox img').height() ) ) / 2;
						var rr = 'rotate(' + (( Math.random() * 2 ) - 1 ) + 'deg)';
						var instant = setTimeout( function() {	
							$('.lightbox img').css({
								'transition': 'all 0.6s ease-out, top 0.7s ease-in-out',
								'-webkit-transition': 'all 0.6s ease-out, top 0.7s ease-in-out',
								'top': '7%',
								'left': l,
								'height': '86%',
								'box-shadow': '0 10px 50px -20px #000',
								'transform': rr,
								'-webkit-transform': rr,
								'opacity': 1,
								'margin-top': (0 - mbh) / 2
							});					
						}, 10);
					}
					else { // Superwide
						$('.lightbox img').css({
							'top': y,
							'left': x,
							'width': w, // + padding?
							'height': 'auto',
							'transform': t,
							'-webkit-transform': t,
							'box-shadow': bs,
							'opacity': 1
						});

						var top = ( $('.lightbox').height() - ( $('.lightbox').width() * $('.lightbox img').height()  * 0.86 / $('.lightbox img').width() ) ) / 2;

						var instant = setTimeout( function() {	
							$('.lightbox img').css({
								'transition': 'all 0.6s ease-out, top 0.7s ease-in-out',
								'-webkit-transition': 'all 0.6s ease-out, top 0.7s ease-in-out',
								'top': top, // Top should be calcuation based on height of image
								'left': '7%',
								'width': '86%',
								'box-shadow': '0 10px 50px -20px #000',
								'transform': 'none',
								'-webkit-transform': 'none',
								'opacity': 1,
								'margin-top': (0 - mbh) / 2
							});					
						}, 10);
					}
				return false;
			});

		});
	}

	function resize_swooshbox() {
		if ( $('.lightbox').length > 0 ) {

			var mbh = $('.menubottom .menu').height();
			if (mbh > 100 ) { mbh = 0 };
			$('.lightbox img').css({
				'transition': 'none',
				'-webkit-transition': 'none'
			});

			if ( ( $(window).width() / $(window).height() ) > ( $('.lightbox img').width() / $('.lightbox img').height() ) ) {
				var l = ( $(window).width() - ( 0.86 * $(window).height() * $('.lightbox img').width() / $('.lightbox img').height() ) ) / 2;
				$('.lightbox img').css({
					'top': '7%',
					'left': l,
					'height': '86%',
					'width': 'auto',
					'margin-top': (0 - mbh) / 2
				});
			}
			else { // Superwide

				var top = ( $('.lightbox').height() - ( $('.lightbox').width() * $('.lightbox img').height()  * 0.86 / $('.lightbox img').width() ) ) / 2;
				$('.lightbox img').css({
					'top': top, // Top should be calcuation based on height of image
					'left': '7%',
					'width': '86%',
					'height': 'auto',
					'margin-top': (0 - mbh) / 2
				});	
			}
		}
	}

} )( jQuery );