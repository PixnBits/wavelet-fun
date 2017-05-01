import React, { Component, PropTypes } from 'react';

import UnCompressed from './UnCompressed';

function verticalMidpoint(pe, pf, pg) {
  const ex = pe[0];
  const ey = pe[1];

  const fx = pf[0];
  const fy = pf[1];

  const gx = pg[0];
  // const gy = pg[1];

  const m = (fy - ey) / (fx - ex);
  const b = ey - (m * ex);

  const hx = gx;
  const hy = (m * hx) + b;

  return [hx, hy];
}

function distance(a, b) {
  return Math.sqrt(
    ((b[0] - a[0]) ** 2) +
    ((b[1] - a[1]) ** 2)
  );
}

class Compression extends Component {
  constructor(props) {
    super(props);
    this.state = { iteration: null };
  }

  componentWillMount() {
    this.initialize();
  }

  // FIXME: re-initialize when props change
  // componentWillRecieveProps() {}

  initialize() {
    const { width, func, sampleCount } = this.props;
    const interval = (width - 1) / sampleCount;
    const samples = [];

    for (let i = 1; i < width; i += interval) {
      samples.push([i, func(i)]);
    }

    if (this.state.intervalHandle) {
      clearInterval(this.state.intervalHandle);
    }

    const intervalHandle = setInterval(() => this.iterate(), 2e3);
    this.setState({
      samples,
      intervalHandle,
      keep: null,
      discard: null,
      kept: null,
      lines: null,
      textInfo: null,

      keepSets: null,
    });
  }

  iterate() {
    const threshold = this.props.threshold;
    const samples = this.state.samples.filter((p, i) => i % 2 === 0);
    const decide = this.state.samples.filter((p, i) => i % 2 === 1);
    const keep = [];
    const discard = [];
    const lines = [];

    decide.forEach((deciding, ind) => {
      let shouldKeep = true;
      let mid;

      const pa = samples[ind];
      const pb = samples[ind + 1];

      if (!pb) {
        shouldKeep = true;
      } else {
        mid = verticalMidpoint(pa, pb, deciding);
        // distance should be just the difference of their y-values
        if (distance(deciding, mid) < threshold) {
          shouldKeep = false;
        }
      }

      if (shouldKeep) {
        keep.push(deciding);
      } else {
        discard.push(deciding);
      }

      if (mid) {
        lines.push([deciding, mid, shouldKeep]);
      }
    });

    const keepSets = (this.state.keepSets || []).concat([]);
    keepSets.unshift(keep);

    this.setState({
      samples,
      keep,
      discard,
      kept: (this.state.kept || []).concat(keep),
      lines,

      keepSets,
    });

    if (samples.length <= 2) {
      clearInterval(this.state.intervalHandle);
      setTimeout(() => this.afterIterating(), 2e3);
    }
  }

  afterIterating() {
    const kept = this.state.kept.concat(this.state.samples);
    const samples = null;// this.state.samples.concat(this.state.kept).sort((a, b) => b[0] - a[0]);
    const textInfo = `${Math.round(100 * (1 - (kept.length / this.props.sampleCount)))}% (${kept.length}/${this.props.sampleCount}, ${this.props.threshold})`;

    const keepSets = (this.state.keepSets || []).concat([]);
    keepSets.unshift(this.state.samples);

    this.setState({
      samples,
      kept,
      keep: null,
      discard: null,
      lines: null,
      textInfo,

      keepSets,
    });

    setTimeout(() => this.initialize(), 6e3);
  }

  render() {
    const { height } = this.props;
    const {
      samples,
      kept,
      textInfo,
      lines,
      keep,
      discard,

      keepSets,
    } = this.state;

    return (
      <g>
        {samples ? (
            null
          ) : (
            <g>
              <UnCompressed compressed={keepSets} height={height} />
              {kept && kept
                .sort((a, b) => a[0] - b[0])
                .map((pa, i) => {
                  const pb = kept[i + 1];
                  if (!pb) {
                    return null;
                  }
                  return (
                    <polyline
                      key={`kept-line-${pa[0]}`}
                      points={`${pa[0]}, ${height - pa[1]} ${pb[0]}, ${height - pb[1]}`}
                      stroke="orange"
                      fill="none"
                    />
                  );
                })
              }
            </g>
          )
        }
        {
          textInfo ? (
            <text
              x="0"
              y="12"
              fontFamily="Arial"
              fontSize="12"
            >
              {textInfo}
            </text>
          ) : (
            null
          )
        }
        {lines && lines.map(l => (
          <polyline
            key={`deciding-line-${l[0][0]}`}
            points={`${l[0][0]}, ${height - l[0][1]} ${l[1][0]}, ${height - l[1][1]}`}
            stroke={l[2] ? 'red' : 'yellow'}
            fill="none"
          />
        ))}

        {kept && kept.map(p => (
          <circle
            key={`kept-${p[0]}`}
            cx={p[0]}
            cy={height - p[1]}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="orange"
            fill="orange"
          />
        ))}
        {kept && kept.map(p => (
          <circle
            key={`kept-bar-${p[0]}`}
            cx={p[0]}
            cy={height - 3}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="orange"
            fill="orange"
          />
        ))}

        {discard && discard.map(p => (
          <circle
            key={`discard-${p[0]}`}
            cx={p[0]}
            cy={height - p[1]}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="yellow"
            fill="yellow"
          />
        ))}
        {discard && discard.map(p => (
          <circle
            key={`discard-bar-${p[0]}`}
            cx={p[0]}
            cy={height - 3}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="yellow"
            fill="none"
          />
        ))}

        {keep && keep.map(p => (
          <circle
            key={`keep-${p[0]}`}
            cx={p[0]}
            cy={height - p[1]}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="red"
            fill="red"
          />
        ))}
        {keep && keep.map(p => (
          <circle
            key={`keep-bar-${p[0]}`}
            cx={p[0]}
            cy={height - 3}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="red"
            fill="red"
          />
        ))}

        {samples && samples.map(p => (
          <circle
            key={`samples-${p[0]}`}
            cx={p[0]}
            cy={height - p[1]}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="blue"
            fill="blue"
          />
        ))}
        {samples && samples.map((p1, ind, arr) => {
          const p2 = arr[ind + 1];
          if (!p2) {
            return null;
          }

          return (
            <polyline
              key={`samples-line-${p1[0]}`}
              points={`${p1[0]}, ${height - p1[1]} ${p2[0]}, ${height - p2[1]}`}
              stroke="blue"
              fill="none"
            />
          );
        })}
      </g>
    );
  }
}

Compression.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired,
  sampleCount: PropTypes.number.isRequired,
  threshold: PropTypes.number,
};

Compression.defaultProps = {
  threshold: 20,
};

export default Compression;
