/* Document Ready function
-------------------------------------------------------------------*/
jQuery(document).ready(function($) {

	"use strict";


    /* Window Height Resize
    -------------------------------------------------------------------*/
    var windowheight = jQuery(window).height();
    if(windowheight > 650)
    {
         $('.pattern').removeClass('height-resize');
    }
    /* Window Height Resize End
    -------------------------------------------------------------------*/



	/* Main Menu
	-------------------------------------------------------------------*/
	$('#headernavigation').onePageNav({
		currentClass: 'active',
		changeHash: true,
		scrollSpeed: 750,
		scrollThreshold: 0.5,
		scrollOffset: 0,
		filter: '',
		easing: 'swing'
	});

	/* Main Menu End
	-------------------------------------------------------------------*/



	/* Time Countdown
	-------------------------------------------------------------------*/
	// $('#time_countdown').countDown({

        // targetDate: {
        //     'day': 30,
        //     'month': 9,
        //     'year': 2015,
        //     'hour': 0,
        //     'min': 0,
        //     'sec': 0
        // },
        // omitWeeks: true

  //        targetOffset: {
  //           'day':      0,
  //           'month':    0,
  //           'year':     1,
  //           'hour':     0,
  //           'min':      0,
  //           'sec':      3
		// },
		// omitWeeks: true

	 //    });

    /* Time Countdown End
	-------------------------------------------------------------------*/




	/* Next Section
	-------------------------------------------------------------------*/
	// $('.next-section .go-to-about').click(function() {
 //    	$('html,body').animate({scrollTop:$('#about').offset().top}, 1000);
 //  	});
 //  	$('.next-section .go-to-subscribe').click(function() {
 //    	$('html,body').animate({scrollTop:$('#subscribe').offset().top}, 1000);
 //  	});
 //  	$('.next-section .go-to-contact').click(function() {
 //    	$('html,body').animate({scrollTop:$('#contact').offset().top}, 1000);
 //  	});
 //  	$('.next-section .go-to-page-top').click(function() {
 //    	$('html,body').animate({scrollTop:$('#page-top').offset().top}, 1000);
 //  	});

  	/* Next Section End
	-------------------------------------------------------------------*/




	      /* Subscribe
    -------------------------------------------------------------------*/
    // $(".news-letter").ajaxChimp({
    //     callback: mailchimpResponse,
    //     url: "http://jeweltheme.us10.list-manage.com/subscribe/post?u=a3e1b6603a9caac983abe3892&amp;id=257cf1a459" // Replace your mailchimp post url inside double quote "".
    // });

    // function mailchimpResponse(resp) {
    //      if(resp.result === 'success') {

    //         $('.alert-success').html(resp.msg).fadeIn().delay(3000).fadeOut();

    //     } else if(resp.result === 'error') {
    //         $('.alert-warning').html(resp.msg).fadeIn().delay(3000).fadeOut();
    //     }
    // };




	/* Contact
	-------------------------------------------------------------------*/
    // $('#contact-submit').click(function () {
    //     $('.first-name-error, .last-name-error, .contact-email-error, .contact-subject-error, .contact-errorMessage-error').hide();
    //     var first_nameVal = $('input[name=first_name]').val();
    //     var last_nameVal = $('input[name=last_name]').val();
    //     var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    //     var emailVal = $('#contact_email').val();
    //     var contact_subjectVal = $('input[name=contact_subject]').val();
    //     var messageVal = $('textarea[name=message]').val();

    //     //validate

    //     if (first_nameVal == '' || first_nameVal == 'First Name *') {
    //         $('.first-name-error').html('<i class="fa fa-exclamation"></i> First name is required.').fadeIn();
    //         return false;
    //     }
    //     if (last_nameVal == '' || last_nameVal == 'Last Name *') {
    //         $('.last-name-error').html('<i class="fa fa-exclamation"></i> Last name is required.').fadeIn();
    //         return false;
    //     }
    //     if (emailVal == "" || emailVal == "Email Address *") {

    //         $('.contact-email-error').html('<i class="fa fa-exclamation"></i> Your email address is required.').fadeIn();
    //         return false;

    //     } else if (!emailReg.test(emailVal)) {

    //         $('.contact-email-error').html('<i class="fa fa-exclamation"></i> Invalid email address.').fadeIn();
    //         return false;
    //     }
    //      if (contact_subjectVal == '' || contact_subjectVal == 'Subject *') {
    //         $('.contact-subject-error').html('<i class="fa fa-exclamation"></i> Subject is required.').fadeIn();
    //         return false;
    //     }
    //     if (messageVal == '' || messageVal == 'Message *') {
    //         $('.contact-errorMessage-error').html('<i class="fa fa-exclamation"></i> Please provide a message.').fadeIn();
    //         return false;
    //     }

    //     var data_string = $('.contact-form').serialize();

    //     $('#contact-submit').hide();
    //     $('#contact-loading').fadeIn();
    //     $('.contact-error-field').fadeOut();

    //     $.ajax({
    //         type: "POST",
    //         url: "php/contact.php",
    //         data: data_string,

    //         //success
    //         success: function (data) {

    //             $('.contact-box-hide').slideUp();
    //             $('.contact-errorMessage').html('<i class="fa fa-check contact-success"></i><div>Your message has been sent.</div>').fadeIn();
    //         },
    //         error: function (data) {

    //             $('.btn-contact-container').hide();
    //             $('.contact-errorMessage').html('<i class="fa fa-exclamation contact-error"></i><div>Something went wrong, please try again later.</div>').fadeIn();
    //         }

    //     }) //end ajax call
    //     return false;
    // });

    function submitForm (data) {
        $.ajax({
            type: "POST",
            url: "contact-form.php",
            data: data,

            //success
            success: function (data) {
                trackEvent('submit', 'success', $('input[name="contact_reason_group"]').val(), function () {
                    $('#contact-form').hide();
                    $('#contact-results').addClass('success').removeClass('error').html('<p><i class="fa fa-check-circle"></i> Thank you for contacting us. Your message has been sent and we will respond soon. If you would like a quicker response, send a text message or gives us a call at:</p><p><strong><a class="btn btn-clear btn-lg u-textLg" href="tel:3852341406"><i class="fa fa-phone"></i> (801) 385-1406</a></strong></p>').fadeIn();
                    $('#contact-form').find('#contact-submit .fa-refresh').fadeOut();
                });
            },
            error: function (data) {
                trackEvent('submit', 'error', $('input[name="contact_reason_group"]').val(), function () {
                    $('#contact-results').addClass('error').removeClass('success').html('<p><i class="fa fa-exclamation-triangle"></i> Sorry, your submission isn\'t able to be processed right now. Please give us a call or try again later.</p>').fadeIn();
                    $('#contact-form').find('#contact-submit .fa-refresh').fadeOut();
                });
            }

        });
    }

    function validateField (param) {
        var $field = param instanceof jQuery ? param : $(param.target);
        var $fieldWrap = $field.parents('.field');
        var $errorMsg = $fieldWrap.find('.error-msg');
        var isValid = true;
        var requiredMsg = $field.siblings('.error-msg').data('error-msg') || 'This field is required.';
        var emailMsg = $field.siblings('.error-msg').data('format-msg') || 'Please enter a valid email address.';
        var phoneMsg = $field.siblings('.error-msg').data('format-msg') || 'Please enter your phone number, numbers only.';

        // Required validation
        if ($field.prop('required') && !$field.hasClass('field-blank')) {
            if ($field.val() === '') {
                $errorMsg.html(requiredMsg);
                isValid = false;
            } else {
                isValid = true;
            }
        }
        // Type validation
        if ($field.attr('type') === 'email') {
            var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
            if (!emailReg.test($field.val())) {
                $errorMsg.html(emailMsg);
                isValid = false;
            } else {
                isValid = true;
            }
        } else if ($field.attr('type') === 'tel') {
            var phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
            if (!phoneRegex.test($field.val())) {
                $errorMsg.html(phoneMsg);
                isValid = false;
            } else {
                isValid = true;
            }
        }

        if (isValid) {
            $fieldWrap.removeClass('error').addClass('success');
            $errorMsg.fadeOut(100);
        } else {
            $fieldWrap.addClass('error').removeClass('success');
            $errorMsg.fadeIn(100);
        }

        return isValid;
    }

    function prepareForm ($form) {
        $form.find('input[type="email"], input[type="tel"]').attr('type', 'text');
    }

    function validateForm (e) {
        e.preventDefault();
        var $form = $(e.target);
        var $fields = $form.find('input[required], input[type="number"], input[type="email"], input[type="tel"], textarea[required]');
        var numErrors = 0;
        // var errorMsg = 'Please fix the errors and try again.';

        $form.find('#contact-submit .fa-refresh').fadeIn();

        $fields.each(function () {
            if (!validateField($(this))) {
                numErrors += 1;
            }
        });

        if (numErrors > 0) {
            $form.find('.contact-errorMessage').fadeIn();
            $form.find('.error').first().focus();
            $form.find('#contact-submit .fa-refresh').fadeOut();
            return false;
        } else {
            $form.find('.contact-errorMessage').fadeOut();
            prepareForm($form);
            var dataString = $form.serialize();
            submitForm(dataString);
        }
    }

    $('#contact-form').on('submit', validateForm);
    $('#contact-form').find('input[required], input[type="number"], input[type="email"], input[type="tel"], textarea[required]').on('change', function () {
        validateField($(this));
    });

    // Field focusing.
    $('#contact-form').find('input, textarea')
        .on('focus', function () {
            var $field = $(this).parent('.field');
            $field.addClass('focused field-callout--active');
        })
        .on('blur', function (e) {
            var $field = $(this).parent('.field');
            $field.removeClass('focused');
            $field.on('click.fieldcallout', function (e) {
                e.stopPropagation();
            });
            $('input, textarea').not(this).on('focus.fieldcallout', function () {
                $field.removeClass('focused field-callout--active');
                $('html').off('click.fieldcallout');
                $field.off('click.fieldcallout');
                $('input, textarea').off('click.fieldcallout');
            });
            $('html').on('click.fieldcallout', function () {
                $field.removeClass('focused field-callout--active');
                $('html').off('click.fieldcallout');
                $field.off('click.fieldcallout');
                $('input, textarea').off('click.fieldcallout');
            });
        });
    // Handler for field-button for field-callouts.
    $('.field-button')
        .on('focus', function () {
            $(this).parent().addClass('focused');
        })
        .on('click', function () {
            $(this).parent().toggleClass('field-callout--active');
        });

    // Input masking / formatting.
    $("#contact_phone").mask("(999) 999-9999", {placeholder: ' '});
    $("#event_date").mask("99/99/9999", {placeholder: 'mm/dd/yyyy'});

    // Handler for form changer.
    $('input[name="contact_reason_group"]').on('change', function () {
        var formName = this.id.replace('radio-', '');
        showContactForm(formName);
    });

    // Handler for clicking on a calendar date.
    $('#calendar-main')
        .on('click', '.calendar-dayAvailable', function (e) {
            var calendar = e.delegateTarget;
            var eventDate = moment(this.getAttribute('data-date')).format('MM/DD/YYYY');
            document.getElementById('event_date').value = eventDate;
            showContactForm('reserve', true, 'first_name');
        });

    function showContactForm(formName, scroll, focusOnId) {
        var formToSelect = '#radio-' + (formName || 'contact');
        var $reserveFormRows = $('.field-eventDate');
        var cb = null;
        $(formToSelect).prop('checked', true);
        if (formName === 'reserve') {
            $reserveFormRows.slideDown().find('input').attr('required', '');
        } else {
            $reserveFormRows.slideUp().find('input').removeAttr('required');
        }
        if (scroll) {
            cb = function () {
                if (!focusOnId) {
                    focusOnId = (formName === 'reserve') ? 'event_date' : 'first_name';
                }
                document.getElementById(focusOnId).focus();
            }
            scrollToHash('#contact', cb);
        }
    }

    /** HANDLER FOR CLICKS ON ANCHOR BUTTON CLICKS --------------------*/
    function scrollToHash(hash, cb) {
        var scrollPx = Math.abs(parseInt(document.querySelector(hash).getBoundingClientRect().top, 10));
        var animationTime = 900;
        if (scrollPx < 600) {
            animationTime = 600;
        } else if (scrollPx > 1000) {
            animationTime = 1200;
        }
        $(window).on('mousewheel.scrollToHash', function () {
            $('html,body').stop();
        });
        $('html,body').stop().animate({scrollTop:$(hash).offset().top}, animationTime, function () {
            if (hash !== '#page-top') {
                window.location.hash = hash;
                // history.pushState('', '', hash);
            }
            $(window).off('mousewheel.scrollToHash');
            // Run callback.
            if (typeof cb === 'function') {
                cb();
            }
        });
        return false;
    }
    function onHashChangeHandler(e) {
        e.preventDefault();
        var hash = window.location.hash || '#page-top';
        if ($(hash).length) {
            scrollToHash(hash);
        }
    }

    window.onhashchange = onHashChangeHandler;

    // Handler for clicks on links.
    $('a').on('click', linkClickHandler);

    function linkClickHandler(e) {
        var el = e.currentTarget;
        var url = el.getAttribute('href');
        e.preventDefault();
        trackEvent('link', 'click', url, gotoUrl, el)
        return false;
    }

    function gotoUrl(el) {
        var url = el.getAttribute('href');
        if (url.charAt(0) === '#') {
            if (url === '#contact') {
                var formName = el.getAttribute('data-form');
                showContactForm(formName, true);
            } else {
                scrollToHash(url);
            }
        } else if (el.getAttribute('target') === '_blank') {
            window.open(url);
        } else {
            document.location = url;
        }
    }

    function trackEvent(category, action, label, cb, params) {
        if (!docCookies.hasItem('analyticsNoTrackCookie') && window.ga) {
            ga('send', 'event', category, action, label, {'hitCallback': function () {
                runCallback(cb, params);
            }});
        } else {
            runCallback(cb, params);
        }
    }

    function runCallback(cb, params) {
        if (typeof cb === 'function') {
            cb(params);
        }
    }


	/* Contact End
	-------------------------------------------------------------------*/


    /** GOOGLE MAP HANDLING --------------------*/
    // Enable pointer events on click.
    // $('#google-map-wrap').on('click', function () {
    //     $('#google-map').removeClass('u-noScroll');
    //     $('#google-map-wrap .input-msg').css('display', 'none');
    // });
    // Disable pointer events on mouseleave.
    // $("#google-map-wrap").mouseleave(function () {
    //     $('#google-map').addClass('u-noScroll');
    //     $('#google-map-wrap .input-msg').css('display', '');
    // });

    $('.btn-map').on('click', openLocationMap);
    $('.btn-map--close').on('click', closeLocationMap);

    function openLocationMap() {
        $('#google-map-wrap').addClass('active');
        $('body').addClass('u-overflowHidden');
        $(document).on('keyup.map', function (e) {
            if (e.keyCode === 27) {
                closeLocationMap();
            }
        });
    }

    function closeLocationMap() {
        $('#google-map-wrap').removeClass('active');
        $('body').removeClass('u-overflowHidden');
        $(document).off('.map');
    }

    /** PARALLAX (desktop only) --------------------*/
    $(window).load(function(){
        var isTouchDevice = 'ontouchstart' in document.documentElement;
        if (!isTouchDevice) {
            $("#page-top").parallax("50%", 0.2);
            $("#subscribe").parallax("50%", 0.2);
        }
    });

});

/* Document Ready function End
-------------------------------------------------------------------*/


/* Preloader
-------------------------------------------------------------------*/
// $(window).load(function () {
    // "use strict";
// $("#loader").fadeOut();
// $("#preloader").delay(350).fadeOut("slow");
// });
 /* Preloder End
-------------------------------------------------------------------*/
