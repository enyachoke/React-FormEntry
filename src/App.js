import React, { Component } from 'react';
var form =  require("json!./form.json");
import {
  BasicForm,
  InputField,
  SelectField,
  TextareaField
} from 'react-serial-forms'
export default class App extends Component {
  constructor() {
    super();
    this.state = {
          serialization: ''
        };
    this.serialization = this.serialization.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  serialization() {
        if (this.refs.myForm) {
          return this.refs.myForm.serialize();
        }
        return {};
      }
      onSubmit(event) {
              var self = this;
              console.log('Submitted. Checking async errors.');
              this.refs.myForm.validate(function(errs) {
                if (errs) {
                  alert('There are ' + errs.length + ' errors.');
                  alert('Check out your console to see them.');
                  console.log(errs);
                  return;
                }
                alert('All passed! No errors.');
              });
              event.preventDefault();
            }
  render() {
    function createChoices(answers){
      var choices = [];
      var i;
      for (i = 0; i < answers.length; i++) {
        var answer = answers[i];
        choices.push({text: answer.label, value: answer.concept});
      }
      return choices;
    }
    var self = this;
       var serialization = JSON.stringify(this.serialization(), null, 2);
    // For the sake of this demo, update the json all the time.
    var attrs = {
         onChange: function() {
          self.forceUpdate();
         }
       };
    return (
      <BasicForm ref='myForm' onKeyUp={this.onChange} onSubmit={this.onSubmit}>
      <div>
        {form.pages.map(function(page, i) {
        return (
          <div key={i}>
            {page.sections.map(function(section, j) {
              return (<div key={j}>{section.label}
                {section.questions.map(function(question, k) {
                  var input = '';
                  if(question.questionOptions.rendering==='number'){
                    input = <p key={k}>
                     <label htmlFor={question.id}>{question.label}</label>
                       <InputField
                         {...attrs}
                         type='number'
                         placeholder=''
                         id={question.id}
                         name={question.id}
                       validation='required'/>
                  </p>
                  }else if (question.questionOptions.rendering==='date') {
                    input = <p key={k}>
                     <label htmlFor={question.id}>{question.label}</label>
                       <InputField
                         {...attrs}
                         type='text'
                         placeholder=''
                         id={question.id}
                         name={question.id}
                       validation='required'/>
                  </p>
                  }else if (question.questionOptions.rendering==='select') {
                    var choices=createChoices(question.questionOptions.answers);
                    input = <p key={k}>
                     <label htmlFor={question.id}>{question.label}</label>
                       <SelectField
                         {...attrs}
                         options={choices}
                         type='text'
                         placeholder=''
                         id={question.id}
                         name={question.id}
                       validation='required'/>
                  </p>
                  }else {
                    input = <p key={k}>
                     <label htmlFor={question.id}>{question.label}</label>
                       <InputField
                         {...attrs}
                         type='text'
                         placeholder=''
                         id={question.id}
                         name={question.id}
                       validation='required'/>
                  </p>
                  }
             return (input);
           })}
              </div>);
            })}
          </div>
        );
      })}
      </div>
      <div className='serialization'>
             <pre>
               {serialization}
             </pre>
           </div>
      </BasicForm>
    );
  }
}
