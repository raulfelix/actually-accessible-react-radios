import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KEY_CODES from './KeyCodes';

const RadioTitle = styled.div`
  font-family: 'Rubik', Arial;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`
const RadioList = styled.ul`
  font-family: 'Rubik', Arial;
  list-style: none;
  margin: 0;
  padding: 0;
  outline: 0;
`
const RadioItem = styled.li`
  cursor: default;
  display: block;
  margin: 0;
  padding: 2px 0 0 32px;
  position: relative;
  margin-bottom: 1rem;

  &.selectable__item--focus span {
    outline: 0;
    box-shadow: rgb(106, 106, 106) 0px 0px 0px 2px inset, rgba(17, 117, 181, 0.6) 0 0 0 2px;
  }

  span {
    position: absolute;
    -webkit-box-align: center;
    align-items: center;
    display: block;
    height: 20px;
    width: 20px;
    box-shadow: rgb(106, 106, 106) 0px 0px 0px 2px inset;
    left: 0px;
    top: 2px;
    border-radius: 50%;
    transition: all 0.3s ease 0s;

    &:after {
      position: absolute;
      content: "";
      background-color: rgb(36, 75, 168);
      height: 20px;
      width: 20px;
      transform: scale(0);
      border-radius: 50%;
      transition: all 0.3s ease 0s;
    }
  }

  ${({isActive}) => isActive && `
    span {
      box-shadow: rgb(36, 75, 168) 0px 0px 0px 2px inset;
      &:after {
        transform: scale(0.55);
      }
    }
    &.selectable__item--focus span {
      outline: 0;
      box-shadow: rgb(36, 75, 168) 0px 0px 0px 2px inset, rgba(17, 117, 181, 0.6) 0 0 0 2px;
    }
  ` }

  ${({isDisabled}) => isDisabled && `
    span {
      opacity: 0.5;
    }
  ` }
`

const RadioGroup = ({ id, label = '', type = '', options, isLabelHidden, onSelect }) => {
  const [activeId, setActiveId] = useState(null)
  const [activeDescendent, setActiveDescendent] = useState(null)
  const [focussed, setFocussed] = useState(null)
  const [radios, setRadios] = useState([])

  useEffect(function() {
    const optionCopy = options.map(o => {
      return {...o}
    });
    let active = optionCopy.find(o => o.isActive);
    setActiveId(active ? active.value : null)
    setActiveDescendent(active ? active.value : null)
    setRadios(optionCopy)
  }, [])

  const labelId = `${id}_label`;
  const classes = ['selectable radios'];

  if (type === 'button') {
    classes.push('selectable--btn');
  }

  function getCSS(o) {
    const classes = ['radios__item selectable__item'];
    if (focussed === o.value) {
      classes.push('selectable__item--focus');
    }
    if (o.isDisabled === true) {
      classes.push('selectable__item--disabled');
    }
    return classes.join(' ');
  }

  function onRadioClick(o) {
    setSelected(o.value);
  }

  function setSelected(id) {
    const option = radios.find(o => o.value === id);
    if (option.isDisabled !== true) {
      setActiveId(id)
      setActiveDescendent(id)
      setFocussed(id)
      if (onSelect) {
        onSelect({
          label: option.label,
          value: option.value
        });
      }
    } else {
      setFocussed(id)
    }
  }

  function onFocus() {
    setFocussed(activeId === null ? radios[0].value : activeId)
  }

  function onKeydown(event) {
    let preventDefaults = true;
    switch (event.key) {
      case KEY_CODES.SPACE:
      case KEY_CODES.RETURN:
        setSelected(focussed);
        break;
      case KEY_CODES.UP:
      case KEY_CODES.LEFT:
        setSelected(getPreviousItem(focussed));
        break;
      case KEY_CODES.DOWN:
      case KEY_CODES.RIGHT:
        setSelected(getNextItem(focussed));
        break;
      default:
        preventDefaults = false;
        break;
    }

    if (preventDefaults) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function getPreviousItem(id) {
    const list = radios;
    const index = radios.findIndex(o => o.value === id);
    if (index === 0) {
      return list[list.length - 1].value;
    }
    return list[index - 1].value;
  }

  function getNextItem(id) {
    const list = radios;
    const index = radios.findIndex(o => o.value === id);
    if (index === list.length - 1) {
      return list[0].value;
    }
    return list[index + 1].value;
  }

  return (
    <>
      <RadioTitle
        id={labelId}
        className={`selectable__title ${isLabelHidden ? 'visually__hidden' : ''}`}
      >
        {label}
      </RadioTitle>
      <RadioList
        id={id}
        className={classes.join(' ')}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-activedescendant={`rb_${activeDescendent}`}
        tabIndex="0"
        onBlur={() => setFocussed(null)}
        onFocus={() => onFocus()}
        onKeyDown={e => onKeydown(e)}
      >
        {
          radios.map(o => (
            <RadioItem
              key={o.value}
              id={`rb_${o.value}`}
              isActive={activeId === o.value}
              isDisabled={o.isDisabled === true}
              className={getCSS(o)}
              role="radio"
              aria-checked={activeId === o.value}
              aria-disabled={o.isDisabled === true}
              onClick={() => onRadioClick(o)}
            >
              <span />
              {o.label}
          </RadioItem>
        ))
        }
      </RadioList>
    </>
  )
}

RadioGroup.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isLabelHidden: PropTypes.bool,
  type: PropTypes.string
};

RadioGroup.defaultProps = {
  isLabelHidden: false,
  type: ''
};

export default RadioGroup;