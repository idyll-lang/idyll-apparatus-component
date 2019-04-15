'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _littleLoader = require('little-loader');

var _littleLoader2 = _interopRequireDefault(_littleLoader);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var emitter = new _events2.default();

var scriptLoaded = false;
var scriptLoading = false;

var Apparatus = function (_React$Component) {
  _inherits(Apparatus, _React$Component);

  function Apparatus(props) {
    _classCallCheck(this, Apparatus);

    var _this = _possibleConstructorReturn(this, (Apparatus.__proto__ || Object.getPrototypeOf(Apparatus)).call(this, props));

    _this.state = {
      viewer: null
    };

    _this._hasInitialized = false;
    _this.handleViewerRender = _this.handleViewerRender.bind(_this);
    _this.handleRef = _this.handleRef.bind(_this);
    return _this;
  }

  _createClass(Apparatus, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (!this.state.viewer) {
        return;
      }
      Object.keys(this.props).filter(function (d) {
        return d.indexOf('_') !== 0 && (_this2.props._writeOnly || []).indexOf(d) === -1;
      }).filter(function (d) {
        return ['error', 'children', 'idyll', 'hasError', 'updateProps'].indexOf(d) === -1;
      }).forEach(function (d) {
        var currentValue = _this2.props[d];
        var newValue = nextProps[d];
        if (currentValue !== newValue) {
          var attribute = _this2.state.viewer.getAttributeByLabel(d);
          attribute.setExpression(newValue);
        }
      });
    }
  }, {
    key: 'handleViewerRender',
    value: function handleViewerRender() {
      var _this3 = this;

      if (!this._hasInitialized) {
        return;
      }
      Object.keys(this.props).filter(function (d) {
        return d.indexOf('_') !== 0;
      }).filter(function (d) {
        return ['error', 'children'].indexOf(d) === -1;
      }).forEach(function (d) {
        var currentValue = _this3.props[d];
        try {
          var attribute = _this3.state.viewer.getAttributeByLabel(d);
          var apparatusValue = attribute.value();
          if (currentValue !== apparatusValue) {
            _this3.props.updateProps(_defineProperty({}, d, apparatusValue));
          }
        } catch (e) {}
      });
    }
  }, {
    key: 'initializeViewer',
    value: function initializeViewer() {
      var _this4 = this;

      if (!this._ref || this.state.viewer) {
        return;
      }

      var viewer = new ApparatusViewer({
        url: this.props._url,
        element: this._ref,
        regionOfInterest: this.props._regionOfInterest,
        onRender: this.handleViewerRender
      });
      this.setState({
        viewer: viewer
      });

      setTimeout(function () {
        Object.keys(_this4.props).filter(function (d) {
          return d.indexOf('_') !== 0 && (_this4.props._writeOnly || []).indexOf(d) === -1;;
        }).filter(function (d) {
          return ['error', 'children', 'idyll', 'hasError', 'updateProps'].indexOf(d) === -1;
        }).forEach(function (d) {
          var val = _this4.props[d];
          try {
            var attribute = viewer.getAttributeByLabel(d);
            attribute.setExpression(val);
          } catch (e) {
            console.warn(e);
          }
        });
        _this4._hasInitialized = true;
      }, 500);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this5 = this;

      if (!scriptLoaded && !scriptLoading) {
        scriptLoading = true;
        (0, _littleLoader2.default)("https://rawgit.com/cdglabs/apparatus-site/gh-pages/editor/dist/apparatus-viewer.js", function (err) {
          if (!err) {
            scriptLoaded = true;
            scriptLoading = false;
            _this5.initializeViewer();
            emitter.emit('scriptloaded');
          } else {
            console.warn(err);
          }
        });
      } else if (scriptLoaded) {
        this.initializeViewer();
      } else {
        emitter.on('scriptloaded', function () {
          _this5.initializeViewer();
        });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'handleRef',
    value: function handleRef(el) {
      // console.log()
      this._ref = el;
      if (scriptLoaded) {
        this.initializeViewer();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _props = this.props,
          className = _props.className,
          _width = _props._width,
          _height = _props._height,
          style = _props.style;

      return _react2.default.createElement('div', { ref: function ref(el) {
          return _this6.handleRef(el);
        }, className: className, style: Object.assign({ margin: '30px auto', width: _width ? _width : '100%', height: _height ? _height : 'auto' }, style) });
    }
  }]);

  return Apparatus;
}(_react2.default.Component);

module.exports = Apparatus;
