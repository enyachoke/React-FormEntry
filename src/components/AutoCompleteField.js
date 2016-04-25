var React = require('react');
import {InputBase} from 'react-serial-forms';
import ReactSuperSelect from './react-super-select';
import { assign } from 'lodash';

export default class AutoCompleteField extends InputBase {
  constructor(props) {
    super(props);
  }
  onChange(event) {
    if(event){
      if(event.constructor === Array){

      }
      if (typeof event === 'object'){
        
      }
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
    if (typeof attrs.initialValue === 'string'){
      delete attrs.initialValue
    }
    return (
      <span className='serial-input-wrapper'>
        <ReactSuperSelect  {...attrs} />
        {errMessage}
      </span>
    );
  }
}
