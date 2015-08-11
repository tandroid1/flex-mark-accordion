# Flexible Markup Accordion
A simple accordion that doesn't really care what your html markup looks like!

## Example

### HTML
```html
<div class="myContainer">
  <div class="header">
    <h3>Heading 1</h3>
  </div>
  <div>Annoying div which is here for some annoying reason.</div>
  <div class="accordion">some accordion content</div>
  <div class="header">
    <h3>Heading 2</h3>
  </div>
  <div>Annoying div which is here for some annoying reason.</div>
  <div class="accordion">some accordion content</div>
  <div class="header">
    <h3>Heading 3</h3>
  </div>
  <div>Annoying div which is here for some annoying reason.</div>
  <div class="accordion">some accordion content</div>
</div>
```

### Javascript 
```javascript
$('.myContainer').fmAccordion({
  toggleButtons: 'h3',
  toggleSections: 'accordion'
});
```

If you have the ability to add classes to your markup you can do so and not have to pass any options to fmAccordion.

```html
...
<div class="fmButton">Heading 1</div>
...
<div class="fmSection">Section content</div>
...
```

```javascript
$('.myContainer').fmAccordion();
```

## Options

- `toggleButtons` - A css selector for the elements that should be used to trigger each accordion section.
- `toggleSection` - A css selector for the elements that should be toggled when the toggleButton is clicked.
- `addToggleClasses` - If set to true, classes will get added to each button and section when it is opened. 
- `responsive` - Set wether or not the accordion should work when the browser is resized.
- `waitForWinLoad` - Necessary for the plugin to properly calculate the height of each section if there are assets that are loaded after document ready. Images are an example of this.
