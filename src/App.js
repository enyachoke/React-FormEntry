import React, { Component } from 'react';
import Immutable from 'immutable'
var form =  require("json!./adult-form.json");
import FormEntry from './components/FormEntry'
export default class App extends Component {

  render() {

    return (
      <FormEntry form={form}/>
    );
  }
}
