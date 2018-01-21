jQuery(document).ready(function($) {
	'use strict';

	/** GOOGLE CALENDAR --------------------*/
	function calendarInit(el) {
		if (!el) {
			return false;
		}
		var calendar = el.querySelector('.calendar-fullCalendar');
		var buttons = el.querySelectorAll('.calendar-btn');
		var loader = el.querySelector('.calendar-loader');
		var gotoDateChoosers = document.querySelectorAll('.calendar-goto[data-calendar="' + el.id + '"]');

		$(calendar)
			.fullCalendar({
				googleCalendarApiKey: 'AIzaSyArYDujX7JNc54RsswbJlT1DSlIH1vYxpo',
				events: {
					googleCalendarId: 'traverselodge@gmail.com'
				},
				themeButtonIcons: false,
				height: 'auto',
				header: {
					left: '',
					center: '',
					right: ''
				},
				viewRender: function(view, element) {
					var monthAndYear = $(calendar)
						.fullCalendar('getDate')
						.format('MMMM YYYY');
					// Render date / month
					$(el)
						.find('.calendar-monthYear')
						.text(monthAndYear);
					// Render dates / day numbers
					$(calendar)
						.find('.fc-day-number')
						.each(function() {
							var day = this;
							var text = $(day).text();
							var iconClass = 'fa-check';
							var eventClass = 'calendar-dayAvailable';
							if ($(day).hasClass('fc-sun') || $(day).hasClass('fc-past')) {
								iconClass = 'fa-times';
								eventClass = 'calendar-dayUnavailable';
							}
							$(day)
								.addClass(eventClass)
								.html(
									'<div class="calendar-daySquare"><div class="calendar-event"><span class="fa ' +
										iconClass +
										'"/></div><div class="calendar-dayNumber">' +
										text +
										'</div></div>'
								);
						});
				},
				loading: function(isLoading, view) {
					if (isLoading) {
						$(loader).fadeIn(80);
						$(calendar)
							.find('.calendar-event')
							.css('opacity', 0);
					} else {
						$(loader).fadeOut(80);
						$(calendar)
							.find('.calendar-event')
							.css('opacity', '');
					}
				},
				eventAfterRender: function(event, element, view) {
					var date = moment(event.start).format('YYYY-MM-DD');
					var container = $(calendar).find('.fc-day-number[data-date="' + date + '"]');
					// Remove link and hide private information...
					element.text('Booked...').removeAttr('href');
					// Determine whether it's an all day, AM, or PM event...
					container
						.removeClass('calendar-dayAvailable')
						.addClass('calendar-dayUnavailable')
						.find('.calendar-event')
						.html('<span class="fa fa-times"/>');
					// if (event.allDay) {
					//     // All day event
					//     container.removeClass('calendar-dayAvailable').addClass('calendar-dayUnavailable').find('.calendar-event').html('<span class="fa fa-times"/>');
					// } else if (event.end.hour() <= 16) {
					//     // PM event
					//     container.addClass('calendar-PMAvailable').find('.calendar-event').html('<span class="fa fa-times"/><span class="fa fa-check"/>');
					// } else if (event.end.hour() > 16) {
					//     // AM event
					//     container.addClass('calendar-AMAvailable').find('.calendar-event').html('<span class="fa fa-check"/><span class="fa fa-times"/>');
					// }
				}
			})
			.on('click', '.fc-day-number', function(e) {
				var calendar = this;
				var dateEl = e.currentTarget;
				var gotoParams = {
					action: 'goto',
					date: calendar.getAttribute('data-date')
				};
				$(calendar).trigger('calendar:goto', gotoParams);
				if (el.id === 'calendar-callout' && !dateEl.classList.contains('calendar-dayUnavailable')) {
					el.parentNode.parentNode.querySelector('.calendar-goto').select();
					el.parentNode.parentNode.classList.remove('field-callout--active');
				}
			})
			.on('calendar:goto', function(e, params) {
				var gotoInput = document.activeElement.classList.contains('calendar-goto')
					? document.activeElement
					: null;
				var date;
				// Update the calendar.
				if (params.duration) {
					$(calendar).fullCalendar('incrementDate', params.duration);
				} else if (params.action === 'goto') {
					$(calendar).fullCalendar('gotoDate', params.date);
				} else {
					$(calendar).fullCalendar(params.action);
				}
				// If selection isn't passed, determine where cursor selection should be; default it to the day.
				if (!params.selection) {
					if (
						params.action === 'prev' ||
						params.action === 'next' ||
						(params.duration && params.duration.months)
					) {
						params.selection = [0, 2];
					} else if (params.duration && params.duration.years) {
						params.selection = [6, 10];
					} else {
						params.selection = [3, 5];
					}
				}
				// Grab the current date from the calendar.
				date = $(calendar).fullCalendar('getDate');
				// Update the gotoDateChooser input's value and cursor selection.
				for (var i = 0; i < gotoDateChoosers.length; i += 1) {
					gotoDateChoosers[i].value = date.format('MM/DD/YYYY');
				}
				if (gotoInput) {
					gotoInput.setSelectionRange(params.selection[0], params.selection[1]);
				}
				// Highlight the active date on the calendar.
				if (calendar.querySelector('.calendar-day--active')) {
					calendar.querySelector('.calendar-day--active').classList.remove('calendar-day--active');
				}
				calendar
					.querySelector('.fc-day-number[data-date="' + date.format('YYYY-MM-DD') + '"]')
					.classList.add('calendar-day--active');
				// Display availability message in goto input.
				if (gotoInput) {
					var dateEl = calendar.querySelector(
						'.fc-day-number[data-date="' + date.format('YYYY-MM-DD') + '"]'
					);
					var fieldEl = el.parentNode.parentNode;
					var calendarMsgEl;
					// Find or create calendar msg element.
					if (fieldEl.querySelector('.calendar-inputMsg')) {
						calendarMsgEl = fieldEl.querySelector('.calendar-inputMsg');
					} else {
						calendarMsgEl = document.createElement('span');
						fieldEl.appendChild(calendarMsgEl);
					}
					calendarMsgEl.classList.add('calendar-inputMsg', 'input-msg', 'u-bgGreen');
					calendarMsgEl.classList.remove('u-bgRed');
					// Determine HTML for calendar msg element.
					if (dateEl.classList.contains('calendar-dayUnavailable')) {
						console.log('contains dayUnavailable class');
						if (dateEl.classList.contains('fc-past')) {
							calendarMsgEl.innerHTML =
								'<span class="fa fa-exclamation-circle"></span> <strong>Umm... ' +
								date.format('dddd, MMM Do') +
								'? </strong> Please try a date in the future. <span class="fa fa-smile-o"></span>';
						} else if (dateEl.classList.contains('fc-sun')) {
							calendarMsgEl.innerHTML =
								'<span class="fa fa-exclamation-circle"></span> <strong>Sorry, we are closed on Sundays.</strong> Please try another date.';
						} else {
							calendarMsgEl.innerHTML =
								'<span class="fa fa-exclamation-circle"></span> <strong>Sorry, ' +
								date.format('dddd, MMM Do') +
								' is unavailable.</strong> Contact us to be notified if it becomes available.';
						}
						calendarMsgEl.classList.remove('u-bgGreen');
						calendarMsgEl.classList.add('u-bgRed');
					} else if (dateEl.classList.contains('calendar-dayAvailable')) {
						calendarMsgEl.innerHTML =
							'<span class="fa fa-check-circle"></span> <strong>' +
							date.format('dddd, MMM Do') +
							' is available!</strong> Send this form to request this date.';
					}
					fieldEl.querySelector('.input-msg').style.display = 'none';
					// fieldEl.querySelector('.calendar-inputMsg').style.display = 'block';
					fieldEl.classList.remove('error');
					calendarMsgEl.style.display = 'block';
				}
			});

		// Handler for calendar toolbar buttons.
		$(buttons).on('click', function(e) {
			var gotoParams = {};
			e.preventDefault();
			gotoParams.action = this.getAttribute('data-action');
			$(calendar).trigger('calendar:goto', gotoParams);
		});

		// Handler for goto date changer.
		$(gotoDateChoosers)
			.on('focus', function(e) {
				var numbersInValue = this.value.replace(/[^0-9]/g, '').length;
				var gotoParams = {};
				var field = this.parentNode;
				$(calendar).fullCalendar('refetchEvents');
				if (numbersInValue === 8) {
					gotoParams.action = 'goto';
					gotoParams.date = this.value;
					$(calendar).trigger('calendar:goto', gotoParams);
					field.querySelector('.calendar-inputMsg').style.display = '';
					field.classList.remove('error');
					field.querySelector('.error-msg').style.display = 'none';
					field.querySelector('.input-msg').style.display = 'none';
				} else {
					gotoParams.action = 'today';
					$(calendar).trigger('calendar:goto', gotoParams);
					field.querySelector('.calendar-inputMsg').style.display = 'none';
					field.querySelector('.input-msg').style.display = '';
					field.classList.remove('error');
					field.querySelector('.error-msg').style.display = 'none';
				}
			})
			.on('blur', function() {
				var field = this.parentNode;
				field.querySelector('.calendar-inputMsg').style.display = 'none';
				field.querySelector('.input-msg').style.display = 'none';
				field.classList.remove('error');
				field.querySelector('.error-msg').style.display = 'none';
			})
			.on('keyup', function(e) {
				var gotoInput = this;
				var numbersInValue = gotoInput.value.replace(/[^0-9]/g, '').length;
				var field = gotoInput.parentNode;
				var cursorPosition = $(gotoInput).getCursorPosition();
				var gotoParams = {};
				// 'd' key press.
				if (e.keyCode === 68) {
					e.preventDefault();
					$(calendar).trigger('calendar:goto', 'today');
				} else if (e.keyCode === 27) {
					// Escape key closes calendar-callout.
					e.preventDefault();
					field.classList.remove('field-callout--active');
					gotoInput.value = $(calendar)
						.fullCalendar('getDate')
						.format('MM/DD/YYYY');
				} else if (e.keyCode === 13) {
					// Enter key enters the selected date.
					e.preventDefault();
					if (field.classList.contains('field-callout--active')) {
						field.classList.remove('field-callout--active');
						gotoInput.select();
					}
				} else if (e.keyCode === 37) {
					// left arrow key press.
					if (cursorPosition > 5) {
						gotoInput.setSelectionRange(3, 5);
					} else {
						gotoInput.setSelectionRange(0, 2);
					}
				} else if (e.keyCode === 39) {
					// right arrow key press.
					if (cursorPosition < 3) {
						gotoInput.setSelectionRange(3, 5);
					} else {
						gotoInput.setSelectionRange(6, 10);
					}
				} else if (e.keyCode === 38 || e.keyCode === 40) {
					// Up and down arrow keys.
					var durationProp = '';
					gotoParams.duration = {};
					gotoInput.parentNode.classList.add('field-callout--active');
					// Determine which duration to increment (months, days, years).
					if (e.altKey) {
						durationProp = 'days';
					} else if (numbersInValue === 8) {
						// If cursor is in month field...
						if (cursorPosition < 3) {
							durationProp = 'months';
						} else if (cursorPosition < 6) {
							// If cursor is in day field...
							durationProp = 'days';
						} else {
							// If cursor is in year field...
							durationProp = 'years';
						}
					} else {
						durationProp = 'days';
					}
					// up arrow key press.
					if (e.keyCode === 38) {
						e.preventDefault();
						gotoParams.duration[durationProp] = e.altKey ? 7 : 1;
					} else if (e.keyCode === 40) {
						// down arrow key press.
						e.preventDefault();
						gotoParams.duration[durationProp] = e.altKey ? -7 : -1;
					}
					$(calendar).trigger('calendar:goto', gotoParams);
				} else if (numbersInValue === 8) {
					// If cursor is in month field...
					if (cursorPosition < 3) {
						gotoParams.selection = [0, 2];
					} else if (cursorPosition < 6) {
						// If cursor is in day field...
						gotoParams.selection = [3, 5];
					} else {
						// If cursor is in year field...
						gotoParams.selection = [6, 10];
					}
					gotoParams.action = 'goto';
					gotoParams.date = gotoInput.value;
					$(calendar).trigger('calendar:goto', gotoParams);
				} else {
					field.querySelector('.calendar-inputMsg').style.display = 'none';
					field.querySelector('.input-msg').style.display = '';
					field.classList.remove('error');
					field.querySelector('.error-msg').style.display = 'none';
				}
			})
			.on('keydown', function(e) {
				var keyCodes = [13, 27, 37, 38, 39, 40, 67, 68];
				// prevent default behavior for up and down arrow keys.
				if (keyCodes.indexOf(e.keyCode) > -1) {
					e.preventDefault();
				}
			});
	}

	// Init for calendar-callout.
	function initCalendarCallout() {
		var el = document.getElementById('calendar-callout');
		if (!el) {
			return false;
		}
		var calendar = el.querySelector('.calendar-fullCalendar');
		var calendarRow = document.querySelector('.field-eventDate');
		var calendarCallout = calendarRow.querySelector('.field-callout');
		// Temporarily show the calendar-callout.
		calendarRow.style.display = 'block';
		calendarCallout.style.display = 'block';
		// Initialize the calendar.
		calendarInit(el);
		// Hide calendar-callout again.
		calendarRow.style.display = '';
		calendarCallout.style.display = '';
	}

	// Init for main calendar.
	calendarInit(document.getElementById('calendar-main'));
	initCalendarCallout();
});
