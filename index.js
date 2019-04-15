import React from 'react';
import load from 'little-loader'
import EventEmitter from 'events';

const emitter = new EventEmitter();

let scriptLoaded = false;
let scriptLoading = false;


class Apparatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewer: null
    }

    this._hasInitialized = false;
    this.handleViewerRender = this.handleViewerRender.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.viewer) {
      return;
    }
    Object.keys(this.props).filter((d) => {
      return d.indexOf('_') !== 0 && (this.props._writeOnly || []).indexOf(d) === -1;
    }).filter((d) => {
      return ['error', 'children', 'idyll', 'hasError', 'updateProps'].indexOf(d) === -1;
    }).forEach((d) => {
      const currentValue = this.props[d];
      const newValue = nextProps[d];
      if (currentValue !== newValue) {
        const attribute = this.state.viewer.getAttributeByLabel(d);
        attribute.setExpression(newValue);
      }
    });
  }

  handleViewerRender() {
    if (!this._hasInitialized) {
      return;
    }
    Object.keys(this.props).filter((d) => {
      return d.indexOf('_') !== 0;
    }).filter((d) => {
      return ['error', 'children'].indexOf(d) === -1;
    }).forEach((d) => {
      const currentValue = this.props[d];
      try {
        const attribute = this.state.viewer.getAttributeByLabel(d);
        const apparatusValue = attribute.value();
        if (currentValue !== apparatusValue) {
          this.props.updateProps({
            [d]: apparatusValue
          })
        }
      } catch(e) {

      }
    })
  }

  initializeViewer() {
    if (!this._ref || this.state.viewer) {
      return;
    }

    const viewer = new ApparatusViewer({
      url: this.props._url,
      element: this._ref,
      regionOfInterest: this.props._regionOfInterest,
      onRender: this.handleViewerRender
    });
    this.setState({
      viewer: viewer
    });

    setTimeout(() => {
      Object.keys(this.props).filter((d) => {
        return d.indexOf('_') !== 0 && (this.props._writeOnly || []).indexOf(d) === -1;;
      }).filter((d) => {
        return ['error', 'children', 'idyll', 'hasError', 'updateProps'].indexOf(d) === -1;
      }).forEach((d) => {
        const val = this.props[d];
        try {
          const attribute = viewer.getAttributeByLabel(d);
          attribute.setExpression(val);
        } catch(e) {
          console.warn(e);
        }
      });
      this._hasInitialized = true;
    }, 500);
  }

  componentDidMount() {
    if (!scriptLoaded && !scriptLoading) {
      scriptLoading = true;
      load("https://rawgit.com/cdglabs/apparatus-site/gh-pages/editor/dist/apparatus-viewer.js", (err) => {
        if (!err) {
          scriptLoaded = true;
          scriptLoading = false;
          this.initializeViewer();
          emitter.emit('scriptloaded');
        } else {
          console.warn(err);
        }
      });
    } else if (scriptLoaded) {
      this.initializeViewer();
    } else {
      emitter.on('scriptloaded', () => {
        this.initializeViewer();
      })
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  handleRef(el) {
    // console.log()
    this._ref = el;
    if (scriptLoaded) {
      this.initializeViewer();
    }
  }

  render() {
    const { className, _width, _height, style } = this.props;
    return (
      <div ref={(el) => this.handleRef(el)} className={className} style={Object.assign({ margin: '30px auto', width: _width ? _width: '100%', height: _height ? _height : 'auto'}, style)} />
    );
  }
}

module.exports = Apparatus;
