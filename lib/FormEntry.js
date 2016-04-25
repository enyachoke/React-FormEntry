'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _AutoCompleteField = require('./AutoCompleteField');

var _AutoCompleteField2 = _interopRequireDefault(_AutoCompleteField);

var _reactSerialForms = require('react-serial-forms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var ReactDOM = require('react-dom');

var _ = require('lodash');

var validations = [{ name: 'confirmpass', operator: '===', reference: 'password' }];
var FormEntry = React.createClass({
  displayName: 'FormEntry',

  getInitialState: function getInitialState() {
    return {
      serialization: '',
      addedPeople: _immutable2.default.List(),
      undoCache: _immutable2.default.List(),
      added: {}
    };
  },
  propTypes: {
    form: React.PropTypes.object.isRequired
  },
  createChoices: function createChoices(answers) {
    var choices = [];
    var i;
    for (i = 0; i < answers.length; i++) {
      var answer = answers[i];
      choices.push({ text: answer.label, value: answer.concept });
    }
    return choices;
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    var form = this.props.form;
    if (!_.isEmpty(form)) {
      self = this;
      self = this;
      form.pages.forEach(function (page) {
        page.sections.forEach(function (section) {
          section.questions.forEach(function (question) {
            if (question.type === 'obsGroup' && question.questionOptions.rendering === 'repeating') {
              self.state['added' + question.id] = _immutable2.default.List();
            }
          });
        });
      });
    }
  },
  addRepeating: function addRepeating(question) {
    var self = this;
    var questionId = question.id;
    var personIndex = this.state['added' + questionId].size;
    var personKey = 'questions' + '[' + personIndex + ']';
    var name = questionId + '[' + personKey;
    var concept = questionId + '[concept]';
    var update = function update() {
      self.forceUpdate();
    };
    var fields = [];
    {
      question.questions.map(function (q, key) {
        //q.id = name+'['+q.id+']';
        fields.push(self.renderQuestion(key, q, name, question.questionOptions.rendering));
      });
    }
    var person = React.createElement(
      'div',
      { key: personIndex, className: 'person' },
      React.createElement(_reactSerialForms.InputField, {
        type: 'hidden',
        value: question.questionOptions.concept,
        placeholder: '',
        onChange: update,
        id: concept,
        name: concept,
        validation: 'required' }),
      fields
    );
    this.setState(function (prev) {
      var newState = {
        undoCache: prev.undoCache.push(this.state['added' + questionId])
      };
      newState['added' + questionId] = prev['added' + questionId].push(person);
      return newState;
    }, update);
  },
  renderQuestion: function renderQuestion(k, question, groupKey, rendering) {
    var questionId = question.id;
    var conceptKey = questionId + '[concept]';
    var answerKey = questionId + '[answer]';
    if (groupKey && rendering === 'group') {
      conceptKey = groupKey + '[' + question.id + ']' + '[concept]';
      answerKey = groupKey + '[' + question.id + ']' + '[answer]';
    } else if (groupKey && rendering === 'repeating') {
      conceptKey = groupKey + '[' + question.id + ']' + '[concept]';
      answerKey = groupKey + '[' + question.id + ']' + '[answer]';
    }
    self = this;
    var update = function update() {
      self.forceUpdate();
    };
    var input = '';
    if (question.questionOptions.rendering === 'number') {
      input = React.createElement(
        'p',
        { key: k },
        React.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        React.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        React.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          onChange: update,
          type: 'number',
          placeholder: '',
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    } else if (question.questionOptions.rendering === 'date') {
      input = React.createElement(
        'p',
        { key: k },
        React.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        React.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        React.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          onChange: update,
          type: 'text',
          placeholder: '',
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    } else if (question.questionOptions.rendering === 'select') {
      //use https://github.com/JedWatson/react-select
      var choices = [{ text: 'Please select', value: '' }].concat(self.createChoices(question.questionOptions.answers));
      input = React.createElement(
        'p',
        { key: k },
        React.createElement(
          'label',
          { htmlFor: question.id },
          question.label
        ),
        React.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        React.createElement(_reactSerialForms.SelectField, {
          className: 'form-control',
          onChange: update,
          options: choices,
          type: 'text',
          placeholder: '',
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    } else if (question.questionOptions.rendering === 'multiCheckbox') {
      //use https://github.com/JedWatson/react-select
      var choices = self.createChoices(question.questionOptions.answers);
      input = React.createElement(
        'p',
        { key: k },
        React.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        React.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        React.createElement(_reactSerialForms.SelectField, {
          className: 'form-control',
          multiple: true,
          onChange: update,
          options: choices,
          type: 'text',
          placeholder: '',
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    } else {
      input = React.createElement(
        'p',
        { key: k },
        React.createElement(
          'label',
          { htmlFor: question.id },
          question.label
        ),
        React.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept,
          validation: 'required' }),
        React.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          type: 'text',
          placeholder: '',
          onChange: update,
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    }
    return input;
  },
  serialization: function serialization() {
    if (this.refs.myForm) {
      return this.refs.myForm.serialize();
    }
    return {};
  },
  onSubmit: function onSubmit(event) {
    var self = this;
    console.log('Submitted. Checking async errors.');
    this.refs.myForm.validate(function (errs) {
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
  render: function render() {
    var self = this;
    function renderGroup(question) {
      var fields = [];
      var questionId = question.id;
      var personIndex = 'n';
      var personKey = 'questions' + '[' + 0 + ']';
      var name = questionId + '[' + personKey;
      var concept = questionId + '[concept]';
      var groupKey = questionId + '[questions]';

      question.questions.map(function (q, key) {
        var qId = q.id;
        var name = name + '[' + qId + ']';
        q.name = name;
        fields.push(self.renderQuestion(key, q, groupKey + '[' + key + ']', question.questionOptions.rendering));
      });
      var person = React.createElement(
        'div',
        { key: personIndex, className: 'person' },
        React.createElement(_reactSerialForms.InputField, _extends({
          type: 'hidden',
          value: question.questionOptions.concept,
          placeholder: ''
        }, attrs, {
          id: concept,
          name: concept,
          validation: 'required' })),
        fields
      );
      return person;
    }

    function createChoices(answers) {
      var choices = [];
      var i;
      for (i = 0; i < answers.length; i++) {
        var answer = answers[i];
        choices.push({ text: answer.label, value: answer.concept });
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
      onChange: function onChange() {
        self.forceUpdate();
      }
    };
    if (_.isEmpty(this.props.form)) {
      return null;
    }
    _reactSerialForms.validation.registerValidator({
      name: 'confirmpass',
      determine: function determine(value, pass, fail) {
        var data = self.serialization();
        var otherValue = findDeep(data, 'password');
        console.log(findDeep(data, 'q12e').answer);
        console.log('Value', value);
        console.log('otherValue', otherValue);
        if (value === otherValue) {
          return pass();
        } else {
          return fail();
        }
      },
      message: 'Password Does not much'
    });
    var testData = [{
      "id": "5507c0528152e61f3c348d56",
      "name": "elit laborum et",
      "size": "Large"
    }, {
      "id": "5507c0526305bceb0c0e2c7a",
      "name": "dolor nulla velit",
      "size": "Medium"
    }];
    return React.createElement(
      'div',
      null,
      React.createElement(
        _reactSerialForms.BasicForm,
        { ref: 'myForm', onKeyUp: this.onChange, onSubmit: this.onSubmit },
        React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(
                'label',
                null,
                'password:'
              ),
              React.createElement(_reactSerialForms.InputField, _extends({ type: 'text' }, attrs, { name: 'password' })),
              React.createElement(
                'label',
                null,
                'confirm:'
              ),
              React.createElement(_reactSerialForms.InputField, _extends({ type: 'text' }, attrs, { validation: 'confirmpass', name: 'confirmPassword' })),
              React.createElement(_AutoCompleteField2.default, _extends({}, attrs, { dataSource: testData, name: 'autoComplete' })),
              this.props.form.pages.map(function (page, i) {
                return React.createElement(
                  'div',
                  { key: i },
                  React.createElement(
                    'div',
                    null,
                    page.sections.map(function (section, j) {
                      return React.createElement(
                        'div',
                        { key: j, className: 'panel panel-primary' },
                        React.createElement(
                          'div',
                          { className: 'panel-heading' },
                          section.label
                        ),
                        React.createElement(
                          'div',
                          null,
                          section.questions.map(function (question, k) {
                            if (question.type === 'obs') {
                              return self.renderQuestion(k, question);
                            } else if (question.type === 'encounterDatetime') {
                              return self.renderQuestion(k, question);
                            } else if (question.type === 'encounterProvider') {
                              return self.renderQuestion(k, question);
                            } else if (question.type === 'encounterLocation') {
                              return self.renderQuestion(k, question);
                            } else if (question.type === 'personAttribute') {
                              return self.renderQuestion(k, question);
                            } else if (question.type === 'obsGroup' && question.questionOptions.rendering === 'group') {
                              return React.createElement(
                                'div',
                                { key: k },
                                renderGroup(question)
                              );
                            } else if (question.type === 'obsGroup' && question.questionOptions.rendering === 'repeating') {
                              if (_.isUndefined(self.state['added' + question.id])) {
                                return null;
                              }
                              return React.createElement(
                                'div',
                                { className: 'well', key: k },
                                React.createElement(
                                  'h2',
                                  null,
                                  question.label
                                ),
                                React.createElement(
                                  'button',
                                  { className: 'btn btn-primary', onClick: function onClick() {
                                      return self.addRepeating(question);
                                    }, type: 'button' },
                                  'Add'
                                ),
                                self.state['added' + question.id].map(function (person) {
                                  return person;
                                })
                              );
                            }
                          })
                        )
                      );
                    })
                  )
                );
              })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(
                'pre',
                null,
                serialization
              )
            )
          )
        )
      )
    );
  }
});
module.exports = FormEntry;
//# sourceMappingURL=FormEntry.js.map