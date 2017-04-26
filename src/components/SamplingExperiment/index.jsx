import React, { Component } from 'react';

import Wave from './Wave';
import Samples from './Samples';
import Compression from './Compression';

import styles from './styles.less';

class SamplingExperiment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const dims = {
      width: 800,
      height: 300,
    };
    const integize = (min, max) => Math.floor(Math.min(Math.max(min, Math.random() * max), max));
    setTimeout(() => {
      // weights
      const a = integize((dims.height / 2) - 15, (dims.height / 2) + 15);
      const b = integize(5, 20);
      const c = integize(20, 60);
      const d = integize(5, 50);
      const e = integize(20, 50);
      const f = integize(5, 50);
      const g = integize(15, 50);
      const h = integize(10, 60);
      const i = integize(15, 50);

      // const {a,b,c,d,e,f,g,h,i} = {a:135, b:5, c:24, d:40, e:20, f:23, g:48, h:54, i:24};
      // const {a,b,c,d,e,f,g,h,i} = {a:135, b:18, c:20, d:11, e:30, f:41, g:32, h:43, i:43};
      // const {a,b,c,d,e,f,g,h,i} = {a:dims.height/2, b:35, c:45, d:0, e:20, f:0, g:48, h:0, i:24};

      console.log({ a, b, c, d, e, f, g, h, i });
      const wave = x => (a) +
                        (b * Math.sin(x / c)) +
                        (d * Math.sin(x / e)) +
                        (f * Math.sin(x / g)) +
                        (h * Math.sin(x / i));

      // const wave = (x) => 0.34*x + 30;
      // const wave = (x) => dims.height / 2;

      this.setState({
        wave,
        sampleCount: 30,
        dims,
      });
    });
  }

  render() {
    const samplingContent = [];

    if (!this.state.wave) {
      samplingContent.push(
        <p key="wave-notice">building wave...</p>
      );
    } else {
      samplingContent.push(
        <svg key="wave-display" {...this.state.dims} xmlns="http://www.w3.org/2000/svg">
          <Wave
            {...this.state.dims}
            func={this.state.wave}
            sampleCount={this.state.sampleCount}
          />
          <Samples
            {...this.state.dims}
            func={this.state.wave}
            sampleCount={this.state.sampleCount}
          />
          <Compression
            {...this.state.dims}
            func={this.state.wave}
            sampleCount={this.state.sampleCount}
          />
        </svg>
      );
    }

    return (
      <experiment className={styles.experiment}>
        <h2>Sampling</h2>
        { samplingContent }
      </experiment>
    );
  }
}

export default SamplingExperiment;
