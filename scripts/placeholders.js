/*
 * Placeholder polyfill
 * Leon Slater
 * http://mynamesleon.com
 * github.com/mynamesleon/placeholder-polyfill
 * requisites: jQuery >= 1.9.1
 */

window.placeholders = window.placeholders || new function ($) {
    'use strict';

    // prevent progression if jQuery is undefined
    if (typeof $ === 'undefined') {
        var throwError = function () {
            throw new Error('jQuery is required');
        };
        return {
            apply: throwError,
            destroy: throwError
        };
    }

    var _self = this,
        _module = {

            /*
             * get inputs on the page
             * @return {jQuery object}
             */
            getInputs: function () {
                return $('input[type="url"], input[type="text"], input[type="tel"], input[type="email"], input[type="password"], textarea');
            },

            /*
             * Wrap input and insert placeholder span into the markup
             * @param $input {jQuery object}: input element
             * @param text {string}: placeholder text
             */
            setSpans: function ($input, text) {
                // wrapper
                $input.wrap('<span class="placeholder-wrapper"></span>');

                // insert placeholder span: when clicked, focus on input
                $('<span class="placeholder placeholder-show">' + text + '</span>').insertAfter($input).on('click', function () {
                    $input.trigger('focus');
                });
            },

            /*
             * Get input's placeholder span
             * @param $input {jQuery object}
             * @return {jQuery object}: placeholder span
             */
            getPlaceholder: function ($input) {
                // use parents to prevent occasional issues with jQuery's siblings method
                return $input.parents('.placeholder-wrapper').find('.placeholder');
            },

            /*
             * Check input value and toggle visibility based on it
             * @param $input {jQuery object}
             */
            checkValue: function ($input) {
                if ($input.val() === '') {
                    _module.getPlaceholder($input).addClass('placeholder-show');
                } else {
                    _module.getPlaceholder($input).removeClass('placeholder-show');
                }
            },

            /*
             * preliminary input check before value check based on event type and hideOnFocus option
             * @param e {object}: event object
             */
            inputCheck: function (e) {
                var eventType = e.type;
                if (_self.hideOnFocus === true) {
                    if (eventType === 'focus') {
                        _module.getPlaceholder($(this)).removeClass('placeholder-show');
                    }
                    // allow to progress to checkValue if blur event
                    if (/input|keyup|focus/i.test(eventType)) {
                        return;
                    }
                } else {
                    // don't do anything on initial focus if placeholder is not set to hide yet
                    if (eventType === 'focus') {
                        return;
                    }
                }
                _module.checkValue($(this));
            },

            /*
             * primary function - binds events and initialises markup build
             */
            run: function () {
                var $input = $(this),
                    text = $input.data('placeholder-text');

                if ($input.data('placeholder-set') === true) {
                    return;
                }

                if (typeof text === 'undefined') {
                    text = $input.attr('placeholder') || ''; // set to empty string if no placeholder attribute
                    $input.data('placeholder-text', text); // store placeholder text
                }

                // don't proceed if there is no placeholder text
                if (text === '') {
                    return;
                }

                // insert necessary markup
                _module.setSpans($input, text);

                // empty the placeholder in case module is used in browsers that support placeholders and bind events
                $input.attr('placeholder', '')
                    .data('placeholder-set', true)
                    .on('blur focus input keyup', _module.inputCheck);

                // check value immediately to check any remembered input value
                _module.checkValue($input);
            },

            destroy: function () {
                var $wrapper = $(this).parents('.placeholder-wrapper');

                if ($wrapper.length) {
                    var $input = $(this);

                    // set placeholder attribute back to original value and unbind events
                    $input.attr('placeholder', ($input.data('placeholder-text') || ''))
                        .data('placeholder-set', false)
                        .off('blur focus input keyup', _module.inputCheck);

                    // insert input after wrapper and remove custom elements
                    $wrapper.after($input).remove();
                }
            }
        };

    /*
     * control placeholder check type
     * if true, placeholder text will disappear immediately on focus (IE behaviour)
     * if false, placeholder will persist until a value is entered (Chrome behaviour)
     */
    _self.hideOnFocus = false;

    /*
     * wrap inputs and insert placeholder span
     * @param $inputs {jQuery object} optional: inputs to apply to
     *       will use all inputs if not passed in
     */
    _self.apply = function ($inputs) {
        $inputs = $inputs || _module.getInputs();
        $inputs.each(_module.run);
    };

    /*
     * destroy polyfill spans and remove associated blur and focus events
     * @param $inputs {jQuery object} optional: inputs to destroy polyfill from
     *       will use all inputs if not passed in
     */
    _self.destroy = function ($inputs) {
        $inputs = $inputs || _module.getInputs();
        $inputs.each(_module.destroy);
    };

    /*
     * create jQuery plugin variant
     * @return {object}: placeholders namespace
     */
    $.fn.placeholders = function () {
        _self.apply(this);
        // return main object to allow destroy method to be chained
        return _self;
    };

}(window.jQuery);
