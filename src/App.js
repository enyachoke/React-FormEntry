import React, { Component } from 'react';
import Immutable from 'immutable'
require("css!./react-simpletabs.css");
import Tabs from 'react-simpletabs'
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
          serialization: '',
          undoCache: Immutable.List()
        };
    this.serialization = this.serialization.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addRepeating = this.addRepeating.bind(this);
    console.log(form.pages);
    self = this;
    form.pages.forEach(function (page) {
      page.sections.forEach(function (section) {
        section.questions.forEach(function (question) {
          if(question.type==='obsGroup' && question.questionOptions.rendering==='repeating'){
            self.state['added'+ question.id] = Immutable.List()
          }
        })
      })
    })
  }
  createChoices(answers){
    var choices = [];
    var i;
    for (i = 0; i < answers.length; i++) {
      var answer = answers[i];
      choices.push({text: answer.label, value: answer.concept});
    }
    return choices;
  }
  addRepeating(question) {
    var self = this;
    var questionId = question.id
    var personIndex = this.state['added'+questionId].size;
    var personKey = 'questions'+'[' + personIndex + ']';
    var name = questionId+'[' + personKey
    var concept = questionId+'[concept]';
    var moods = [
      { text: 'Happy' , value: 'happy' },
      { text: 'Aloof' , value: 'aloof' }
    ];
    var update = function() {
      self.forceUpdate();
    };
    var fields = []
    {question.questions.map(function(q, key) {
       var qId = q.id;
       if(q.questionOptions.rendering==='number'){
       fields.push(<p key={key}>
          <label htmlFor={qId}>{q.label}</label>
            <InputField
              type='number'
              placeholder=''
              onChange={update}
              id={name + '['+qId+']'}
             name={name + '['+qId+']'}
            validation='required'/>
       </p>)
     }else if (q.questionOptions.rendering==='date') {
         fields.push(<p key={key}>
          <label htmlFor={q.id}>{q.label}</label>
            <InputField
              type='text'
              placeholder=''
              onChange={update}
              id={name + '['+qId+']'}
             name={name + '['+qId+']'}
            validation='required'/>
       </p>)
     }else if (q.questionOptions.rendering==='select') {
         var choices=self.createChoices(q.questionOptions.answers);
        fields.push( <p key={key}>
          <label htmlFor={qId}>{q.label}</label>
            <SelectField
              options={choices}
              type='text'
              placeholder=''
              onChange={update}
              id={name + '['+qId+']'}
             name={name + '['+qId+']'}
            validation='required'/>
       </p>)
       }else {
         fields.push(<p key={key}>
          <label htmlFor={qId}>{q.label}</label>
            <InputField
              type='text'
              placeholder=''
              onChange={update}
              id={name + '['+qId+']'}
             name={name + '['+qId+']'}
            validation='required'/>
       </p>)
       }
    })}
    var person = (
      <div key={personIndex} className='person'>
      <InputField
        type='hidden'
        value={question.questionOptions.concept}
        placeholder=''
        onChange={update}
        id={concept}
       name={concept}
      validation='required'/>
        {fields}
      </div>
    );
    this.setState(function(prev) {
      var newState = {
        undoCache: prev.undoCache.push(this.state['added'+questionId]),
      }
      newState['added'+questionId] = prev['added'+questionId].push(person)
      return newState;
    }, update);
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
    function renderGroup(question){
      var self = this;
      var fields = []
      var questionId = question.id
      var personIndex = 'n';
      var personKey = 'questions'+'[' + 0 + ']';
      var name = questionId+'[' + personKey
      var concept = questionId+'[concept]';
      var moods = [
        { text: 'Happy' , value: 'happy' },
        { text: 'Aloof' , value: 'aloof' }
      ];

      question.questions.map(function(q, key) {
         var qId = q.id;
         if(q.questionOptions.rendering==='number'){
         fields.push(<p key={key}>
            <label htmlFor={qId}>{q.label}</label>
              <InputField
                type='number'
                placeholder=''
              {...attrs}
                id={name + '['+qId+']'}
               name={name + '['+qId+']'}
              validation='required'/>
         </p>)
       }else if (q.questionOptions.rendering==='date') {
           fields.push(<p key={key}>
            <label htmlFor={q.id}>{q.label}</label>
              <InputField
                type='text'
                placeholder=''
                {...attrs}
                id={name + '['+qId+']'}
               name={name + '['+qId+']'}
              validation='required'/>
         </p>)
       }else if (q.questionOptions.rendering==='select') {
           var choices=createChoices(q.questionOptions.answers);
          fields.push( <p key={key}>
            <label htmlFor={qId}>{q.label}</label>
              <SelectField
                options={choices}
                type='text'
                placeholder=''
                {...attrs}
                id={name + '['+qId+']'}
               name={name + '['+qId+']'}
              validation='required'/>
         </p>)
         }else {
           fields.push(<p key={key}>
            <label htmlFor={qId}>{q.label}</label>
              <InputField
                type='text'
                placeholder=''
                {...attrs}
                id={name + '['+qId+']'}
               name={name + '['+qId+']'}
              validation='required'/>
         </p>)
         }
      })
      var person = (
        <div key={personIndex} className='person'>
        <InputField
          type='hidden'
          value={question.questionOptions.concept}
          placeholder=''
          {...attrs}
          id={concept}
         name={concept}
        validation='required'/>
          {fields}
        </div>
      );
      return person;
    }
    function renderQuestion(k,question){
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
      return input;
    }
    function renderObsGroup(k,question) {
      console.log(question);
    }
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
      <Tabs>
        {form.pages.map(function(page, i) {
        return (
          <Tabs.Panel key={i} title={page.label}>
          <div >
            {page.sections.map(function(section, j) {
              return (<div key={j}>{section.label}
                {section.questions.map(function(question, k) {
                  if(question.type==='obs'){
                    return (renderQuestion(k,question));
                  }else if(question.type==='encounterDatetime'){
                    return (<div key={k}></div>);
                  }else if (question.type==='encounterProvider') {
                    return (<div key={k}></div>);
                  }
                 else if (question.type==='encounterLocation') {
                   return (<div key={k}></div>);
                 }else if (question.type==='personAttribute') {
                   return (<div key={k}></div>);
                 }else if (question.type==='obsGroup' && question.questionOptions.rendering==='group') {
                    return (<div key={k}>Group
                        {renderGroup(question)}
                    </div>)
                  }else if (question.type==='obsGroup' && question.questionOptions.rendering==='repeating') {
                    return (<div key={k}>Repeating Group
                      <button onClick={()=>self.addRepeating(question)} type='button'>Add</button>
                      {
                        self.state['added'+ question.id].map(function(person) {
                        return person;
                      })}


                    </div>)
                  }
           })}
              </div>);
            })}
          </div>
          </Tabs.Panel>
        );
      })}
    </Tabs>
      <div className='serialization'>
             <pre>
               {serialization}
             </pre>
           </div>
      </BasicForm>
    );
  }
}
