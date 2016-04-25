import React from 'react';
import {InputBase} from 'react-serial-forms';
import 'react-widgets/lib/less/react-widgets.less'
import Multiselect from 'react-widgets/lib/Multiselect'
export default class MultiSelectField extends InputBase {
  constructor(props) {
    super(props);
  }
  onChange(event) {
    console.log(event)
    if(Array.isArray(event)){
      this.updateValue(event);
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
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
      );}
    return (
      <div>
        <Multiselect {...attrs}/>
        {errMessage}
      </div>
    );
  }
}
