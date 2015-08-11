!function($){
  "use strict";

  $.fn.productAccordion = function(options) {
    var settings = $.extend({
      toggleSections: '',
      toggleButtons: '',
      addToggleClasses: false,
      responsive: true,
      waitForWinLoad: true,
      debug: false
    }, options);

    var $base = this;
    var $toggleSections = $.isPlainObject(settings.toggleSections) ? settings.toggleSections : $(settings.toggleSections);
    var $toggleButtons = $.isPlainObject(settings.toggleButtons) ? settings.toggleButtons : $(settings.toggleButtons);
    var $sectionWrappers;
    var sectionInfo = [];
    var recalcInfo;

    function init() {
      $toggleSections.each(function(i) {
        var $section = $(this);

        // wrap each section so we can always find it's child height.
        $section.wrap('<div class="accordion-wrapper" />');

        sectionInfo[i] = {
          height: $section.outerHeight(true)
        };

        // Set all to closed besides the first one.
        sectionInfo[i].open = i <= 0;
      });

      $sectionWrappers = $base.find('.accordion-wrapper');

      $sectionWrappers.each(function () {
        $(this).css('overflow', 'hidden');
      });

      // Set the first item to be open.
      toggle(0);

      $toggleButtons.click(function(e) {
        e.preventDefault();

        toggle($toggleButtons.index(this));
      });

      // Resize events
      $(window).resize(function() {
        recalc();
      });
    }

    /**
     * Open the section at the passed in index and close all other sections.
     * @param index
     */
    function toggle(index) {
      var $section = $sectionWrappers.eq(index);
      var $button = $toggleButtons.eq(index);
      var info = sectionInfo[index];

      $sectionWrappers.each(function(i) {
        setHeight($(this), 0);

        if (settings.addToggleClasses) {
          $(this).removeClass('accordion-open');
          $toggleButtons.eq(i).removeClass('accordion-open');
        }
      });

      setHeight($section, info.height);

      if (settings.addToggleClasses) {
        $section.addClass('accordion-open');
        $button.addClass('accordion-open');

      }
      recalcInfo = {
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
    function getHeight(index) {
      return sectionInfo[index].height = $sectionWrappers.children().outerHeight(true);
    }

    /**
     * Recalculate and reset the height of all sections.
     */
    function recalc() {
      setHeight(recalcInfo.section, getHeight(recalcInfo.index));
    }

    if ($toggleButtons && $toggleSections) {
      if (settings.waitForWinLoad) {
        $(window).load(function() {

          // Run init once the window has loaded.
          init();
        });
      } else {
        // Run init as soon as possible.
        init();
      }
    } else {
      // Tell you that you messed up if debug mode is on.
      console.log('You must provide a value for toggleSections and toggleButtons');
    }
  };
}(jQuery);