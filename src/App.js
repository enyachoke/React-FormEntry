import React, { Component } from 'react';
import Immutable from 'immutable'
require("css!./react-simpletabs.css");
import Tabs from 'react-simpletabs'
var form =  require("json!./adult-form.json");
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
    var update = function() {
      self.forceUpdate();
    };
    var fields = []
    {question.questions.map(function(q, key) {
       //q.id = name+'['+q.id+']';
       fields.push(self.renderQuestion(key,q,name,question.questionOptions.rendering))
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
  renderQuestion(k,question,groupKey,rendering){
    var questionId = question.id
    var conceptKey=questionId+'[concept]'
    var answerKey=questionId+'[answer]'
    if (groupKey && rendering==='group'){
      conceptKey=groupKey+'['+question.id+']'+'[concept]'
      answerKey=groupKey+'['+question.id+']'+'[answer]'
    }else if (groupKey && rendering==='repeating') {
      conceptKey=groupKey+'['+question.id+']'+'[concept]'
      answerKey=groupKey+'['+question.id+']'+'[answer]'
    }
    self = this;
    var update = function() {
      self.forceUpdate();
    };
    var input = '';
    if(question.questionOptions.rendering==='number'){
      input = <p key={k}>
       <label htmlFor={questionId}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}/>
         <InputField
           className="form-control"
           onChange={update}
           type='number'
           placeholder=''
           id={answerKey}
           name={answerKey}
         validation='required'/>
    </p>
    }else if (question.questionOptions.rendering==='date') {
      input = <p key={k}>
       <label htmlFor={questionId}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}/>
         <InputField
           className="form-control"
           onChange={update}
           type='text'
           placeholder=''
           id={answerKey}
           name={answerKey}
         validation='required'/>
    </p>
    }else if (question.questionOptions.rendering==='select') {
      var choices=self.createChoices(question.questionOptions.answers);
      input = <p key={k}>
       <label htmlFor={question.id}>{question.label}</label>
         <InputField
           className="form-control"
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
          name={conceptKey}
           value={question.questionOptions.concept}/>
         <SelectField
           className="form-control"
           onChange={update}
           options={choices}
           type='text'
           placeholder=''
           id={answerKey}
           name={answerKey}
         validation='required'/>
    </p>
    }
    else if (question.questionOptions.rendering==='multiCheckbox') {
      var choices=self.createChoices(question.questionOptions.answers);
      input = <p key={k}>
       <label htmlFor={questionId}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}/>
         <SelectField
           className="form-control"
            multiple={true}
           onChange={update}
           options={choices}
           type='text'
           placeholder=''
           id={answerKey}
           name={answerKey}
         validation='required'/>
    </p>
    }
    else {
      input = <p key={k}>
       <label htmlFor={question.id}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}
         validation='required'/>
         <InputField
           className="form-control"
           type='text'
           placeholder=''
           onChange={update}
           id={answerKey}
           name={answerKey}
         validation='required'/>
    </p>
    }
    return input;
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
    var self = this;
    function renderGroup(question){
      var fields = []
      var questionId = question.id
      var personIndex = 'n';
      var personKey = 'questions'+'[' + 0 + ']';
      var name = questionId+'[' + personKey
      var concept = questionId+'[concept]';
      var groupKey = questionId+'[questions]'
      var moods = [
        { text: 'Happy' , value: 'happy' },
        { text: 'Aloof' , value: 'aloof' }
      ];

      question.questions.map(function(q, key) {
        var qId = q.id;
        var name = name + '['+qId+']'
        q.name = name;
         fields.push(self.renderQuestion(key,q,groupKey+'['+key+']',question.questionOptions.rendering))
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
          <div className='container' >
        <div className='row' >
      <div className='col-md-8' >
      <Tabs>
        {form.pages.map(function(page, i) {
        return (
          <Tabs.Panel key={i} title={page.label}>
          <div  >
            {page.sections.map(function(section, j) {
              return (<div key={j}>{section.label}
                {section.questions.map(function(question, k) {
                  if(question.type==='obs'){
                    return (self.renderQuestion(k,question));
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
                    return (<div  key={k}>
                        {renderGroup(question)}
                    </div>)
                  }else if (question.type==='obsGroup' && question.questionOptions.rendering==='repeating') {
                    return (<div className='well' key={k}>
                      <h2>{question.label}</h2>
                      <button className='btn btn-primary' onClick={()=>self.addRepeating(question)} type='button'>Add</button>
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
  </div>
      <div className='col-md-4'>
             <pre>
               {serialization}
             </pre>
           </div>
         </div>
       </div>
      </BasicForm>
    );
  }
}
