import React from 'react';
import {InputBase} from 'react-serial-forms';
import 'react-widgets/lib/less/react-widgets.less'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import Moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
momentLocalizer(Moment)

export default class DateField extends InputBase {
  constructor(props) {
    super(props);
  }
  onChange(event) {
      console.log(event)
      this.updateValue(new Date(event));
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(new Date(event));
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
        <DateTimePicker {...attrs}/>
        {errMessage}
      </div>
    );
  }
}
