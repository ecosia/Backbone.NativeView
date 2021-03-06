(function() {

  // When testing alternative View implementations, change this varaible.
  var View = Backbone.NativeView;

  var view;

  module("Backbone.NativeView", {

    setup: function() {
      view = new View({el: '#testElement'});
    }

  });

  test("extending", 3, function() {
    var BaseView = Backbone.View.extend();
    var NativeView = Backbone.NativeView;

    var ExtendedView = Backbone.View.extend(Backbone.NativeViewMixin);

    var MixinView = _.extend(BaseView, Backbone.NativeViewMixin);
    MixinView.prototype.initialize = function(options) { this._domEvents = []; }

    ok((new NativeView)._domEvents);
    ok((new ExtendedView)._domEvents);
    ok((new MixinView)._domEvents);
  });

  test("View#$", function() {
    var result = view.$('h1');
    equal(result.length, 1);
    equal(result[0].tagName.toLowerCase(), 'h1');
    equal(result[0].nodeType, 1);
  });
  
  test("View#setElement", function() {
    var result = view.$('h1');
    view.setElement(result);
    equal(view.el, result[0]);
  });

  test("delegate and undelegate", 6, function() {
    var counter1 = 0, counter2 = 0;
    view.delegate('click', function() { counter1++; });
    addEventListener.call(view.el, 'click', function() { counter2++ });

    click(view.el);

    equal(counter1, 1);
    equal(counter2, 1);
    equal(view._domEvents.length, 1);

    view.undelegate('click');

    click(view.el);

    equal(counter1, 1);
    equal(counter2, 2);
    equal(view._domEvents.length, 0);
  });

  test("undelegating only affects matched handlers", 3, function() {
    view.delegate('click', 'h1', function() { ok(false); });
    view.delegate('click', 'div', function() { ok(true); });
    view.undelegate('click', 'h1');

    _.each(view.$('h1, div'), click);

    // // We don't currently do any selector matching. Fix this
    // view.undelegate('click', '.one');
    // _.each(view.$('h1, div'), click);
  });


  // Cross-browser helpers
  var addEventListener = typeof Element != 'undefined' && Element.prototype.addEventListener || function(eventName, listener) {
    return this.attachEvent('on' + eventName, listener);
  };

  function click(element) {
    var event;
    if (document.createEvent) {
      event = document.createEvent('MouseEvent');
      var args = [
        'click', true, true,
        // IE 10+ and Firefox require these
        event.view, event.detail, event.screenX, event.screenY, event.clientX,
        event.clientY, event.ctrlKey, event.altKey, event.shiftKey,
        event.metaKey, event.button, event.relatedTarget
      ];
      (event.initMouseEvent || event.initEvent).apply(event, args);
    } else {
      event = document.createEventObject();
      event.type = 'click';
      event.bubbles = true;
      event.cancelable = true;
    }

    if (element.dispatchEvent) {
      return element.dispatchEvent(event);
    }
    element.fireEvent('onclick', event);
  }
})();

