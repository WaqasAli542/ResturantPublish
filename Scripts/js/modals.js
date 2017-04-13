/* Copyright (c) 2012 Jeremy McPeak http://www.wdonline.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function(){

/**
 * IE version check by James Padolsey
 * https://gist.github.com/527683
 *
 * Yeah, yeah. Browser sniffing is so awful, bad practice, blah blah.
 * We need the version to check filter out all versions except 8.
 */
var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}());

// You are no IE8
if (ie !== 8) {
    // Goodbye
    return;
}

// create an MS event object and get prototype
var proto = document.createEventObject().constructor.prototype;

/**
 * Indicates whether an event propagates up from the target.
 * @returns Boolean
 */
Object.defineProperty( proto, "bubbles", {
    get: function() {
        // not a complete list of DOM3 events; some of these IE8 doesn't support
        var bubbleEvents = [ "select", "scroll", "click", "dblclick",
            "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
            "keydown", "keypress", "keyup"],
            type = this.type;

        for (var i = 0, l = bubbleEvents.length; i < l; i++) {
            if (type === bubbleEvents[i]) {
                return true;
            }
        }

        return false;
    }
});


/**
 * Indicates whether or not preventDefault() was called on the event.
 * @returns Boolean
 */
Object.defineProperty( proto, "defaultPrevented", {
    get: function() {
        // if preventDefault() was never called, or returnValue not given a value
        // then returnValue is undefined
        var returnValue = this.returnValue,
            undef;

        return !(returnValue === undef || returnValue);
    }
});


/**
 * Gets the secondary targets of mouseover and mouseout events (toElement and fromElement)
 * @returns EventTarget or {null}
 */
Object.defineProperty( proto, "relatedTarget", {
    get: function() {
        var type = this.type;

        if (type === "mouseover" || type === "mouseout") {
            return (type === "mouseover") ? this.fromElement : this.toElement;
        }

        return null;
    }
});


/**
 * Gets the target of the event (srcElement)
 * @returns EventTarget
 */
Object.defineProperty( proto, "target", {
    get: function(){ return this.srcElement; }
});


/**
 * Cancels the event if it is cancelable. (returnValue)
 * @returns {undefined}
 */
proto.preventDefault = function() {
    this.returnValue = false;
};

/**
 * Prevents further propagation of the current event. (cancelBubble())
 * @returns {undefined}
 */
proto.stopPropagation = function() {
    this.cancelBubble = true;
};

/***************************************
 *
 * Event Listener Setup
 *    Nothing complex here
 *
 ***************************************/

/**
 * Determines if the provided object implements EventListener
 * @returns boolean
*/
var implementsEventListener = function (obj) {
    return (typeof obj !== "function" && typeof obj["handleEvent"] === "function");
};

var customELKey = "__eventShim__";

/**
 * Adds an event listener to the DOM object
 * @returns {undefined}
 */
var addEventListenerFunc = function(type, handler, useCapture) {
    // useCapture isn't used; it's IE!

    var fn = handler;

    if (implementsEventListener(handler)) {

        if (typeof handler[customELKey] !== "function") {
            handler[customELKey] = function (e) {
                handler["handleEvent"](e);
            };
        }

        fn = handler[customELKey];
    }

    this.attachEvent("on" + type, fn);
};

/**
 * Removes an event listener to the DOM object
 * @returns {undefined}
 */
var removeEventListenerFunc = function (type, handler, useCapture) {
    // useCapture isn't used; it's IE!

    var fn = handler;

    if (implementsEventListener(handler)) {
        fn = handler[customELKey];
    }

    this.detachEvent("on" + type, fn);
};

// setup the DOM and window objects
HTMLDocument.prototype.addEventListener = addEventListenerFunc;
HTMLDocument.prototype.removeEventListener = removeEventListenerFunc;

Element.prototype.addEventListener = addEventListenerFunc;
Element.prototype.removeEventListener = removeEventListenerFunc;

window.addEventListener = addEventListenerFunc;
window.removeEventListener = removeEventListenerFunc;

}());

/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 * NB: modified for IE8 compatibility.
 * Uses jQuery to attach event handlers so we can use trigger() effectively
 */
var ModalEffects = (function() {

	function init() {

 		  // var overlay = document.querySelector( '.md-overlay' );
     var body = document.querySelector('body')
     var html = document.querySelector('html')
     // var loading = $('.js-modal-loading');

     $(".md-trigger").each(function(index,el) {

      			var modal  = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
         				close  = modal.querySelector( '.md-close'),
             cancel = modal.querySelector( '.md-cancel');

      			function removeModal( hasFixed ) {
             classie.remove( modal, 'md-show' );
             var overlay = $(modal).siblings('.md-overlay')[0]
             classie.remove( overlay, 'activeoverlay')
             classie.remove( body, 'md-polyfill-show')
             classie.remove( html, 'md-hide-scrollbar')
             
             if( hasFixed ) {
                 classie.remove( document.documentElement, 'md-fixed' );
                 // set scroll position to pre-modal state
                 $('body').scrollTop(window.bodyTop);
                 delete window.bodyTop;
             }

             if ( classie.has( modal, 'md-showform' ) ) { 
                 setTimeout( function() {
                      classie.remove( modal, 'md-showform' );
                      classie.add( modal, 'md-hideform' );
                 }, 500 );
             }

      			}

      			function removeModalHandler() {
             $(document).trigger('modal-closed',el) // hook for other events
             removeModal( classie.has( el, 'md-setfixed' ) );
             // lastFocus.focus();
      			}

     			$(el).on( 'click', function( ev ) {
             
             // ev.preventDefault();

             // lastFocus = document.activeElement;
             // modal.setAttribute('tabindex', '0');
             // modal.focus();
             
             // add md-fixed to HTML to adjust the layout
             // save the scroll position so we can set it when the modal closes
             if ( classie.has( el, 'md-setfixed' ) ) {
                 // loading.show();
                 window.bodyTop = $('body').scrollTop();
                 setTimeout( function() {
                      classie.add( document.documentElement, 'md-fixed' );
                 }, 500 );
                 // loading.hide();
             }

             if ( classie.has( modal, 'md-hideform' ) ) { 
                 classie.remove( modal, 'md-hideform' );
                 classie.add( modal, 'md-showform' );
             }

             classie.add( modal, 'md-show' );
             var overlay = $(modal).siblings('.md-overlay')[0]
             classie.add( overlay, 'activeoverlay')
             classie.add( body, 'md-polyfill-show')
             classie.add( html, 'md-hide-scrollbar')
         				overlay.removeEventListener( 'click', removeModalHandler );
         				overlay.addEventListener( 'click', removeModalHandler );

      			});

      			$(close).on( 'click', function( ev ) {
      				ev.stopPropagation();
      				removeModalHandler();
      			});

         $(cancel).on( 'click', function( ev ) {
           ev.preventDefault();
           ev.stopPropagation();
           removeModalHandler();
         });
         
         $(modal).on('click',function( ev ) {
           if(ev.target != modal) return; // only clicks on the blur
           ev.stopPropagation();
           removeModalHandler();
         })

     })
 }

	init();

})();

$('a.md-trigger[href="#"]').on('click',function(e) {
  e.preventDefault();
});