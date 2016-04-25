var React = require('react');
var ReactDOM = require('react-dom');
import Immutable from 'immutable';
import AutoCompleteField from './AutoCompleteField'
var _ = require('lodash');
import {
  BasicForm,
  InputField,
  SelectField,
  TextareaField
} from 'react-serial-forms'
import { validation } from 'react-serial-forms';
var validations = [{name:'confirmpass',operator:'===',reference:'password'}]
var FormEntry = React.createClass( {
  getInitialState: function() {
        return {
          serialization: '',
          addedPeople: Immutable.List(),
          undoCache: Immutable.List(),
          added:{}
        };
      },
  propTypes: {
    form: React.PropTypes.object.isRequired
  },
  createChoices: function(answers){
    var choices = [];
    var i;
    for (i = 0; i < answers.length; i++) {
      var answer = answers[i];
      choices.push({
        id: answer.concept,
        name: answer.label,
        size: "Large"
      });
    }
    return choices;
  },
  componentWillReceiveProps: function() {
    var form = this.props.form;
    if(!_.isEmpty(form)){
      self = this;
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
  },
  addRepeating: function(question) {
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
  },
  renderQuestion: function(k,question,groupKey,rendering){
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
      //use https://github.com/JedWatson/react-select
      var choices=[{text:'Please select',value:''}].concat(self.createChoices(question.questionOptions.answers));
      input = <div key={k}>
       <label htmlFor={question.id}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}/>
         <AutoCompleteField
           id={answerKey}
           onChange={update}
           searchable={true}
           dataSource={choices}
           name={answerKey} validation='required'/>
       </div>
    }
    else if (question.questionOptions.rendering==='multiCheckbox') {
      //use https://github.com/JedWatson/react-select
      var choices=self.createChoices(question.questionOptions.answers);
      input = <div key={k}>
       <label htmlFor={questionId}>{question.label}</label>
         <InputField
           type='hidden'
           placeholder=''
           onChange={update}
           id={conceptKey}
           name={conceptKey}
           value={question.questionOptions.concept}/>
           <AutoCompleteField
             id={answerKey}
             onChange={update}
             searchable={true}
             tags={true}
             dataSource={choices}
             name={answerKey} validation='required'/>
         </div>
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
  },
  serialization: function() {
        if (this.refs.myForm) {
          return this.refs.myForm.serialize();
        }
        return {};
      },
onSubmit: function(event) {
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
      },
  render: function() {
    var self = this;
    function renderGroup(question){
      var fields = []
      var questionId = question.id
      var personIndex = 'n';
      var personKey = 'questions'+'[' + 0 + ']';
      var name = questionId+'[' + personKey
      var concept = questionId+'[concept]';
      var groupKey = questionId+'[questions]'

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
    function findDeep(obj, keyToFind) {
    var result = null;

    _.find(obj, function (value, key) {
        if (key === keyToFind) {
            return result = value;
        } else if (_.isObject(value) && !_.isFunction(value)) {
            return result = findDeep(value, keyToFind);
        }
    });

    return result;
}
    var attrs = {
         onChange: function() {
          self.forceUpdate();
         }
       };
       if(_.isEmpty(this.props.form)){
         return null
       }
       validation.registerValidator({
      name: 'confirmpass',
      determine: function(value, pass, fail) {
        var data = self.serialization();
        var otherValue = findDeep(data,'password')
        console.log(findDeep(data,'q12e').answer)
        console.log('Value',value)
        console.log('otherValue',otherValue)
        if(value===otherValue){
          return pass();
        }else{
          return fail();
        }
      },
      message: 'Password Does not much'
    });
    var testData = [
    {
      "id": "5507c0528152e61f3c348d56",
      "name": "elit laborum et",
      "size": "Large"
    },
    {
      "id": "5507c0526305bceb0c0e2c7a",
      "name": "dolor nulla velit",
      "size": "Medium"
    }
    ];
    return (
      <div>
      <BasicForm ref='myForm' onKeyUp={this.onChange} onSubmit={this.onSubmit}>
      <div className='container' >
        <div className='row' >
          <div className='col-md-6' >
            <label>password:</label>
        <InputField type='text' {...attrs}  name='password' />
          <label>confirm:</label>
        <InputField type='text' {...attrs}  validation='confirmpass' name='confirmPassword' />
        {this.props.form.pages.map(function(page, i) {
        return (
          <div key={i}>
          <div>
            {page.sections.map(function(section, j) {
              return (<div key={j} className="panel panel-primary">
              <div className="panel-heading">
                {section.label}
                </div>
                <div>
                {section.questions.map(function(question, k) {
                  if(question.type==='obs'){
                    return (self.renderQuestion(k,question));
                  }else if(question.type==='encounterDatetime'){
                    return (self.renderQuestion(k,question));
                  }else if (question.type==='encounterProvider') {
                    return (self.renderQuestion(k,question));
                  }
                 else if (question.type==='encounterLocation') {
                   return (self.renderQuestion(k,question));
                 }else if (question.type==='personAttribute') {
                   return (self.renderQuestion(k,question));
                 }else if (question.type==='obsGroup' && question.questionOptions.rendering==='group') {
                    return (<div  key={k}>
                        {renderGroup(question)}
                    </div>)
                  }else if (question.type==='obsGroup' && question.questionOptions.rendering==='repeating') {
                    if(_.isUndefined(self.state['added'+ question.id])){
                      return null;
                    }
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
           </div>
              </div>);
            })}

          </div>
           </div>
        );
      })}
      </div>
      <div className='col-md-6'>
             <pre>
               {serialization}
             </pre>
           </div>
         </div>
       </div>
      </BasicForm>
      </div>
    );
  }
} );
module.exports = FormEntry;
