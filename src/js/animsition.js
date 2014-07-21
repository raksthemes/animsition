/*!
 * animsition v3.1.1
 * http://blivesta.github.io/animsition/
 * Licensed under MIT
 * Author : blivesta
 * http://blivesta.com/
 */
(function($) {
  var namespace = "animsition";
  var methods = {
    init: function(options) {
      options = $.extend({
        inClass: "animsition-in-duration",
        outClass: "animsition-out-duration",
        linkElement: ".animsition-link",
        touchSupport: true,
        unSupportCss: [ "animation-duration", "-webkit-animation-duration", "-o-animation-duration" ]
      }, options);
      var support = methods.supportCheck.call(this, options);
      if (support === false) {
        console.log("Animsition does not support this browser.");
        return methods.destroy.call(this);
      }
      var bindEvts = "click." + namespace;
      if (options.touchSupport) {
        bindEvts += " touchend." + namespace;
      }
      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);
        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });
          $(window).on("load." + namespace, function() {
            methods.pageIn.call(_this);
          });
          $(window).on("unload." + namespace, function() {});
          $(options.linkElement).on(bindEvts, function(event) {
            event.preventDefault();
            var $self = $(this);
            methods.pageOut.call(_this, $self);
          });
        }
      });
    },
    supportCheck: function(options) {
      var $this = $(this);
      var props = options.unSupportCss;
      var support = false;
      for (var i = 0; i < props.length; i++) {
        if (typeof $this.css(props[i]) === "string") {
          support = true;
          break;
        }
      }
      return support;
    },
    pageIn: function() {
      var $this = $(this);
      var options = $this.data(namespace).options;
      var inClass = $this.data("animsition-in");
      var inDelay = $("." + options.inClass).css("animation-duration").replace(/s/g, "") * 1e3;
      var inOutClass = function() {
        $this.addClass(inClass);
      };
      inOutClass();
      setTimeout(function() {
        $this.removeClass(inClass + " " + options.inClass).addClass(options.outClass).css({
          opacity: 1
        });
      }, inDelay);
    },
    pageOut: function($self) {
      var $this = $(this);
      var options = $this.data(namespace).options;
      var url = $self.attr("href");
      var selfOutClass = $self.data("animsition-out");
      var bodyOutClass = $this.data("animsition-out");
      var outDelay = $("." + options.outClass).css("animation-duration").replace(/s/g, "") * 1e3;
      var stream = function() {
        location.href = url;
      };
      var outClass;
      var addOutClass = function() {
        if (selfOutClass) {
          outClass = selfOutClass;
        } else {
          outClass = bodyOutClass;
        }
        $this.addClass(outClass);
      };
      addOutClass();
      setTimeout(function() {
        stream();
      }, outDelay);
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this);
        $(window).unbind("." + namespace);
        $this.removeClass(namespace).removeData(namespace);
      });
    }
  };
  $.fn.animsition = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + method + " does not exist on jQuery." + namespace);
    }
  };
})(jQuery);