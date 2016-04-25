'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactSerialForms = require('react-serial-forms');

var _reactSuperSelect = require('./react-super-select');

var _reactSuperSelect2 = _interopRequireDefault(_reactSuperSelect);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var AutoCompleteField = function (_InputBase) {
  _inherits(AutoCompleteField, _InputBase);

  function AutoCompleteField(props) {
    _classCallCheck(this, AutoCompleteField);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AutoCompleteField).call(this, props));
  }

  _createClass(AutoCompleteField, [{
    key: 'onChange',
    value: function onChange(event) {
      if (event) {
        this.updateValue(event.name);
      } else {
        this.updateValue('');
      }
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var errMessage = React.createElement('span', null);
      var attrs = this.attrs();

      if (attrs.className) {
        attrs.className += ' ' + this.getClassName();
      } else {
        attrs.className = this.getClassName();
      }

      if (this.state.error) {
        errMessage = React.createElement(
          'span',
          { className: 'err-msg' },
          this.state.error.message
        );
      }
      if (typeof attrs.initialValue === 'string') {
        delete attrs.initialValue;
      }
      return React.createElement(
        'span',
        { className: 'serial-input-wrapper' },
        React.createElement(_reactSuperSelect2.default, attrs),
        errMessage
      );
    }
  }]);

  return AutoCompleteField;
}(_reactSerialForms.InputBase);

exports.default = AutoCompleteField;
module.exports = exports['default'];
//# sourceMappingURL=AutoCompleteField.js.map