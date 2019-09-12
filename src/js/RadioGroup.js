import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import KEY_CODES from './KeyCodes';

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
    box-shadow: rgba(17, 117, 181, 0.6) 0 0 0 3px;
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
  ` }
`

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        let activeId = null;
        const options = [];

        props.options.forEach((o) => {
            options.push({
                id: o.id,
                label: o.label,
                value: o.value,
                isActive: o.isActive,
                isDisabled: o.isDisabled
            });

            if (o.isActive) {
                activeId = o.value;
            }
        });

        this.state = {
            activeId,
            activedescendant: activeId,
            focussed: null,
            options
        };
    }

    onRadioClick(o) {
        this.setSelected(o.value);
    }

    onBlur() {
        this.setState({
            focussed: null
        });
    }

    onFocus() {
        const {
            activeId,
            options
        } = this.state;

        if (activeId === null) {
            // activate first item
            this.setState({
                focussed: options[0].value
            });
        } else {
            this.setState({
                focussed: activeId
            });
        }
    }

    onKeydown(event) {
        let preventDefaults = true;
        const {focussed} = this.state;

        switch (event.key) {
            case KEY_CODES.SPACE:
            case KEY_CODES.RETURN:
                this.setSelected(focussed);
                break;
            case KEY_CODES.UP:
            case KEY_CODES.LEFT:
                this.setSelected(this.getPreviousItem(focussed));
                break;
            case KEY_CODES.DOWN:
            case KEY_CODES.RIGHT:
                this.setSelected(this.getNextItem(focussed));
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

    getCSS(o) {
        const classes = ['radios__item selectable__item'];

        if (this.state.focussed === o.value) {
            classes.push('selectable__item--focus');
        }

        if (o.isDisabled === true) {
            classes.push('selectable__item--disabled');
        }

        return classes.join(' ');
    }

    getPreviousItem(id) {
        const list = this.state.options;
        const index = this.getIndex(id);
        if (index === 0) {
            return list[list.length - 1].value;
        }
        return list[index - 1].value;
    }

    getNextItem(id) {
        const list = this.state.options;
        const index = this.getIndex(id);
        if (index === list.length - 1) {
            return list[0].value;
        }
        return list[index + 1].value;
    }

    getIndex(id) {
        return this.state.options.findIndex(o => o.value === id);
    }

    setSelected(id) {
        const option = this.state.options.find(o => o.value === id);

        if (option.isDisabled !== true) {
            this.setState({
                activeId: id,
                activedescendant: id,
                focussed: id
            });

            if (this.props.onSelect) {
                this.props.onSelect({
                    label: option.label,
                    value: option.value
                });
            }
        } else {
            this.setState({
                focussed: id
            });
        }
    }

    render() {
        const {
            id,
            label,
            type
        } = this.props;
        const labelId = `${id}_label`;
        const classes = ['selectable radios'];

        if (type === 'button') {
            classes.push('selectable--btn');
        }

        return (
          <>
            <div
              id={labelId}
              className={`selectable__title ${this.props.isLabelHidden ? 'visually__hidden' : ''}`}
            >
              {label}
            </div>
            <RadioList
                id={id}
                className={classes.join(' ')}
                role="radiogroup"
                aria-labelledby={labelId}
                aria-activedescendant={`rb_${this.state.activedescendant}`}
                tabIndex="0"
                onBlur={() => this.onBlur()}
                onFocus={() => this.onFocus()}
                onKeyDown={e => this.onKeydown(e)}
              >
                  {
                      this.state.options.map(o => (
                          <RadioItem
                            key={o.value}
                            id={`rb_${o.value}`}
                            isActive={this.state.activeId === o.value}
                            className={this.getCSS(o)}
                            role="radio"
                            aria-checked={this.state.activeId === o.value}
                            aria-disabled={o.isDisabled === true}
                            onClick={() => this.onRadioClick(o)}
                          >
                            <div>
                              <span />
                              {o.label}
                            </div>
                          </RadioItem>
                      ))
                  }
            </RadioList>
          </>
        );
    }
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
