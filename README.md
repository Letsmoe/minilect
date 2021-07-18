# MiniLect
A small but very feature rich select alternative written in JavaScript using jQuery
MiniLect is the smallest select alternative (at least that i could find) that comes with all the usual stuff integrated into the browser based select but with advanced event listeners and searching in 2 supported variants (One-letter search and string-search). Everything is customizable, you can find the CSS and JS in the `src` directory, with an example [here](https://continuum-ai.de/dist/continuum_select) and in the `demo` directory.

# Size
MiniLect is to my knowledge the smallest available select alternative apart from [TinyNav.js](http://tinynav.com/) coming in at just 3.85kB minified and at a compression ratio of 253%, at 1.38kB minified and compressed.

# Functionality
MiniLect allows you to tune into multiple events like a HoverNode event which we for example use to show a preview at realtime. The obligatory "change" event and events that are triggered once the select menu opens and closes. FUrthermore you can customize the search function and use shorthand descriptors for the select like setting `o` for options instead of `option` allowing you to write less code resulting in a faster loading page.
