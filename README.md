# Placeholder Polyfill
jQuery dependent Placeholder polyfill

Unlike other placeholder polyfills, this one relies on inserting custom elements into the DOM, instead of inserting the placeholder text as a value into the input. The main advantage of this is that you don't have to worry about the inserted placeholder text affecting your form validation.

## Installation
Just grab the zip from the [releases](https://www.github.com/mynamesleon/placeholder-polyfill/releases) here on Git.

Or install via bower `bower install wordify`

## Usage
The script file adds a `placeholders` object to the global namespace with the following properties:

```js
{
    /*
     * control placeholder check type
     * if true, placeholder text will disappear immediately on focus (IE behaviour)
     * if false, placeholder will persist until a value is entered (Chrome behaviour)
     */
    hideOnFocus: false,

    /*
     * wrap inputs and insert placeholder span
     * @param $inputs {jQuery object} optional: inputs to apply to
     *       will use all inputs if not passed in
     */
    apply: function ($inputs) {
        // plugin code
    },

    /*
     * destroy polyfill spans and remove associated blur and focus events
     * @param $inputs {jQuery object} optional: inputs to destroy polyfill from
     *       will use all inputs if not passed in
     */
    destroy: function ($inputs) {
        // plugin code
    }
}
```

So the custom placeholders can be applied, or destroyed, simply by calling `placeholders.apply()` or `placeholders.destroy()` respectively.

It also includes a jQuery plugin variant:

```js
$('input[type="text"]').placeholders();
```

The jQuery plugin variant can have the destroy method chained onto it if necessary, e.g.

```js
$('input[type="text"]').placeholders().destroy();
```
