'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _AutoCompleteField = require('./fields/AutoCompleteField');

var _AutoCompleteField2 = _interopRequireDefault(_AutoCompleteField);

var _reactSerialForms = require('react-serial-forms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormEntry = _react2.default.createClass({
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
    form: _react2.default.PropTypes.object.isRequired
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
    var person = _react2.default.createElement(
      'div',
      { key: personIndex, className: 'person' },
      _react2.default.createElement(_reactSerialForms.InputField, {
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
      input = _react2.default.createElement(
        'p',
        { key: k },
        _react2.default.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        _react2.default.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        _react2.default.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          onChange: update,
          type: 'number',
          placeholder: '',
          id: answerKey,
          name: answerKey,
          validation: 'required' })
      );
    } else if (question.questionOptions.rendering === 'date') {
      input = _react2.default.createElement(
        'p',
        { key: k },
        _react2.default.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        _react2.default.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        _react2.default.createElement(_reactSerialForms.InputField, {
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
      input = _react2.default.createElement(
        'p',
        { key: k },
        _react2.default.createElement(
          'label',
          { htmlFor: question.id },
          question.label
        ),
        _react2.default.createElement(_reactSerialForms.InputField, {
          className: 'form-control',
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        _react2.default.createElement(_reactSerialForms.SelectField, {
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
      input = _react2.default.createElement(
        'p',
        { key: k },
        _react2.default.createElement(
          'label',
          { htmlFor: questionId },
          question.label
        ),
        _react2.default.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept }),
        _react2.default.createElement(_reactSerialForms.SelectField, {
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
      input = _react2.default.createElement(
        'p',
        { key: k },
        _react2.default.createElement(
          'label',
          { htmlFor: question.id },
          question.label
        ),
        _react2.default.createElement(_reactSerialForms.InputField, {
          type: 'hidden',
          placeholder: '',
          onChange: update,
          id: conceptKey,
          name: conceptKey,
          value: question.questionOptions.concept,
          validation: 'required' }),
        _react2.default.createElement(_reactSerialForms.InputField, {
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
      var person = _react2.default.createElement(
        'div',
        { key: personIndex, className: 'person' },
        _react2.default.createElement(_reactSerialForms.InputField, _extends({
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
    var attrs = {
      onChange: function onChange() {
        self.forceUpdate();
      }
    };
    if (_.isEmpty(this.props.form)) {
      return null;
    }
    var options = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }];
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _reactSerialForms.BasicForm,
        { ref: 'myForm', onKeyUp: this.onChange, onSubmit: this.onSubmit },
        _react2.default.createElement(
          'div',
          { className: 'container' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-6' },
              this.props.form.pages.map(function (page, i) {
                return _react2.default.createElement(
                  'div',
                  { key: i },
                  _react2.default.createElement(
                    'div',
                    null,
                    page.sections.map(function (section, j) {
                      return _react2.default.createElement(
                        'div',
                        { key: j, className: 'panel panel-primary' },
                        _react2.default.createElement(
                          'div',
                          { className: 'panel-heading' },
                          section.label
                        ),
                        _react2.default.createElement(
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
                              return _react2.default.createElement(
                                'div',
                                { key: k },
                                renderGroup(question)
                              );
                            } else if (question.type === 'obsGroup' && question.questionOptions.rendering === 'repeating') {
                              if (_.isUndefined(self.state['added' + question.id])) {
                                return null;
                              }
                              return _react2.default.createElement(
                                'div',
                                { className: 'well', key: k },
                                _react2.default.createElement(
                                  'h2',
                                  null,
                                  question.label
                                ),
                                _react2.default.createElement(
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
            _react2.default.createElement(
              'div',
              { className: 'col-md-6' },
              _react2.default.createElement(
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