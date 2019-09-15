## Actually accessible react radios

A radio group is used when one option must be selected from two or more options. One option can be selected by default (usually the top of the list) or all options can begin unselected, however, it’s common that a selection is required in order to proceed.

A fully [WCAG2.1](https://www.w3.org/WAI/WCAG21/Understanding/) compliant switch component.

This includes full keyboard support and will work with the following screen reader pairings:
* Chrome/Windows + Jaws
* Safari/OSX + Voice over

The behaviour in other pairings is not catered for so may or may not function as expected. In general however, testing with NVDA has also yielded good results.

### Installation
```npm i actually-accessible-react-radios --save```

### Usage

```
import ReactDOM from 'react-dom';
import React from 'react';
import Switch from 'actually-accessible-react-radios';

const options = [
  {id: '1', label: 'Option 1', value: 1},
  {id: '2', label: 'Option 2', value: 2},
  {id: '3', label: 'Option 3', value: 3},
  {id: '4', label: 'Option 4', value: 4, isDisabled: true},
  {
    id: '5', label: 'Option 5', value: 5, isActive: true, isDisabled: true
  }
];

ReactDOM.render(
  <RadioGroup
    id="demo1"
    label="Some title"
    name="fields"
    options={options}
    onSelect={o => console.log(o)}
  />,
  window.document.getElementById('demo')
);
```

### Props
**id** `required` - Unique control identifier

**label** `required` - Not visible by set as aria-label attribute

**onSelect(Object)** `required` - A function called when a radio selection or change occurs

**options** `required` - An array of options to render. Each option must have an `id`, `label` and a `value`. Additional properties such as `isActive` can be passed on one option to indicate when an item is selected. An option can also be disabled using the `isDisabled` property.

**isLabelHidden** `optional` - Do not display group title and only make it available to a screen reader

### Accessibility

Keyboard interaction

`TAB` Moves focus to the checked radio button in the radiogroup. If a radio button is not checked, focus moves to the first radio button in the group.

`SPACE` If the radio button with focus is not checked, changes state to checked. Otherwise, it does nothing.

`DOWN` `RIGHT` Moves focus to and checks the next radio button in the group. If focus is on the last radio button, moves focus to first radio. If an item is disabled focus will still be moved to the item so screen readers will announce the state of the radio.

`UP` `LEFT` Moves focus to and checks the previous radio button in the group. If focus is on the first radio button, moves to last radio. If an item is disabled focus will still be moved to the item so screen readers will announce the state of the radio.