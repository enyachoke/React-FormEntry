import React from 'react';
import {InputBase} from 'react-serial-forms';
import Select from 'react-select';
export default class AutoCompleteField extends InputBase {
  constructor(props) {
    super(props);
  }
  onChange(event) {
    if(Array.isArray(event)){
      var selected = [];
      for (var i in event) {
        selected.push(event[i].value)
      }
      this.updateValue(selected);
    }else {
      this.updateValue(event.value);
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event);
    }
  }
  render() {
    let errMessage = <span />;
    const attrs = this.attrs();

    if (attrs.className) {
      attrs.className += ` ${this.getClassName()}`;
    } else {
      attrs.className = this.getClassName();
    }

    if (this.state.error) {
      errMessage = (
        <span className='err-msg'>
          {this.state.error.message}
        </span>
      );
    }
    return (
      <span className='serial-input-wrapper'>
        <Select {...attrs}/>
        {errMessage}
      </span>
    );
  }
}
