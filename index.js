import React from 'react';
import load from 'little-loader'
import EventEmitter from 'events';

const emitter = new EventEmitter();

let scriptLoaded = false;
let scriptLoading = false;

//http://stackoverflow.com/questions/4588119/get-elements-css-selector-when-it-doesnt-have-an-id
function fullPath(el){
  var names = [];
  while (el.parentNode){
    if (el.id){
      names.unshift('#'+el.id);
      break;
    }else{
      if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
      else{
        for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
        names.unshift(el.tagName+":nth-child("+c+")");
      }
      el=el.parentNode;
    }
  }
  return names.join(" > ");
}


class Apparatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewer: null
    }

    this.handleViewerRender = this.handleViewerRender.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.viewer) {
      return;
    }
    Object.keys(this.props).filter((d) => {
      return d.indexOf('_') !== 0;
    }).filter((d) => {
      return ['error', 'children'].indexOf(d) === -1;
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
    console.log('initializing viewer')
    console.log({
      url: this.props._url,
      selector: fullPath(this._ref),
      regionOfInterest: this.props._regionOfInterest,
      onRender: this.handleViewerRender
    })
    this.setState({
      viewer: new ApparatusViewer({
        url: this.props._url,
        selector: fullPath(this._ref),
        regionOfInterest: this.props._regionOfInterest,
        onRender: this.handleViewerRender
      })
    });
  }

  componentDidMount() {
    if (!scriptLoaded && !scriptLoading) {
      scriptLoading = true;
      load("https://rawgit.com/cdglabs/apparatus-site/gh-pages/editor/dist/apparatus-viewer.js", (err) => {
        console.log('script loaded')
        if (!err) {
          console.log('no error')
          scriptLoaded = true;
          scriptLoading = false;
          this.initializeViewer();
          emitter.emit('scriptloaded');
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