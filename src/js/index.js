import ReactDOM from 'react-dom';
import React from 'react';
import RadioGroup from './RadioGroup';

const options = [
  {id: 'o_1', label: 'Option 1', value: 1},
  {id: 'o_2', label: 'Option 2', value: 2},
  {id: 'o_3', label: 'Option 3', value: 3},
  {id: 'o_4', label: 'Option 4', value: 4, isDisabled: true},
  {
    id: 'o_5', label: 'Option 5', value: 5, isActive: true, isDisabled: true
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