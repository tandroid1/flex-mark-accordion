!function($){
  "use strict";

  function Accordion(item, options) {
    this.settings = $.extend({
      toggleSections: '',
      toggleButtons: '',
      addToggleClasses: false,
      toggleClassName: 'accordion-open',
      responsive: true,
      waitForWinLoad: true,
      defaultOpenItem: 0,
      debug: false
    }, options);

    this.item = $(item);

    this.$toggleSections = $.isPlainObject(this.settings.toggleSections) ? this.settings.toggleSections : $(this.settings.toggleSections);
    this.$toggleButtons = $.isPlainObject(this.settings.toggleButtons) ? this.settings.toggleButtons : $(this.settings.toggleButtons);
    this.$sectionWrappers = '';
    this.sectionInfo = [];
    this.recalcInfo = '';
    this.disabled = false;
    this.created = false;
    this.lastIndex = this.settings.defaultOpenItem;
    preInit(this);
  }

  $.fn.fmAccordion = function (opt) {
    // slice arguments to leave only arguments after function name
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function() {
      var item = $(this), instance = item.data('Accordion');
      if (!instance) {
        // create plugin instance and save it in data
        item.data('Accordion', new Accordion(this, opt));
      } else {
        // if instance already created call method
        if (typeof opt === 'string') {
          instance[opt].apply(instance, args);
        }
      }
    });
  };

  Accordion.prototype = {
    disable: function() {
      disable(this);
    },
    enable: function() {
      enable(this);
    }
  };

  function init(instance) {
    instance.$toggleSections.each(function(i) {
      var $section = $(this);

      // wrap each section so we can always find it's child height.
      $section.wrap('<div class="accordion-wrapper" />');

      instance.sectionInfo[i] = {
        height: $section.outerHeight(true)
      };

      // Set all to closed aside from the default open item.
      if (!instance.disabled) {
        instance.sectionInfo[i].open = i === instance.settings.defaultOpenItem;
      }
    });

    instance.$sectionWrappers = instance.item.find('.accordion-wrapper');

    instance.$sectionWrappers.each(function () {
      $(this).css('overflow', 'hidden');
    });

    // Set the first item to be open.
    if (!instance.disabled) {
      toggle(instance.settings.defaultOpenItem, instance);
    }

    instance.$toggleButtons.click(function(e) {
      e.preventDefault();

      toggle(instance.$toggleButtons.index(this), instance);
    });

    // Resize events
    $(window).resize(function() {
      if (!instance.disabled) {
        recalc(instance);
      }
    });
    instance.created = true;
    instance.item.trigger('accordionReady');
  }

  /**
   * Open the section at the passed in index and close all other sections.
   * @param index
   */
  function toggle(index, instance) {
    var $section = instance.$sectionWrappers.eq(index);
    var $button = instance.$toggleButtons.eq(index);
    var info = instance.sectionInfo[index];

    instance.lastIndex = index;

    instance.$sectionWrappers.each(function(i) {
      setHeight($(this), 0);

      if (instance.settings.addToggleClasses) {
        $(this).removeClass(instance.settings.toggleClassName);
        instance.$toggleButtons.eq(i).removeClass(instance.settings.toggleClassName);
      }
    });

    setHeight($section, info.height);

    if (instance.settings.addToggleClasses) {
      $section.addClass(instance.settings.toggleClassName);
      $button.addClass(instance.settings.toggleClassName);
    }

    instance.recalcInfo = {
      index: index,
      section: $section
    };
  }

  /**
   * Set the height of a section.
   * @param $el - jQuery element to set the height on.
   * @param height
   */
  function setHeight($el, height) {
    $el.css({
      'min-height': height,
      'max-height': height
    });
  }

  /**
   * Get the height of the element at the provided index.
   * @param index
   * @returns Number
   */
  function getHeight(index, instance) {
    return instance.sectionInfo[index].height = instance.$sectionWrappers.eq(index).children().outerHeight(true);
  }

  /**
   * Recalculate and reset the height of all sections.
   */
  function recalc(instance) {
    setHeight(instance.recalcInfo.section, getHeight(instance.recalcInfo.index, instance));
  }

  function enable(instance) {
    if (instance.disabled && instance.created) {
      instance.disabled = false;

      instance.$sectionWrappers.each(function(i) {

        instance.sectionInfo[i].open = i === instance.settings.defaultOpenItem;

        $(this).css('overflow', 'hidden');
      });

      // Set the last open item to be open again.
      toggle(instance.lastIndex, instance);
    }
  }

  /**
   * Removes any styling related to the accordion.
   * @param instance
   */
  function disable(instance) {
    if (!instance.disabled && instance.created) {
      instance.disabled = true;

      instance.$sectionWrappers.each(function() {
        $(this).attr('style', '');
      });
    }
  }

  function preInit(instance) {
    if (instance.$toggleButtons && instance.$toggleSections) {
      if (instance.settings.waitForWinLoad) {
        $(window).load(function() {

          // Run init once the window has loaded.
          init(instance);
        });
      } else {
        // Run init as soon as possible.
        init(instance);
      }
    } else {
      // Tell you that you messed up if debug mode is on.
      console.log('You must provide a value for toggleSections and toggleButtons');
    }
  }
}(jQuery);
