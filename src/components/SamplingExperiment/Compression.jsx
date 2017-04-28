import React, { Component, PropTypes } from 'react';

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
    const points = [];

    for (let i = 1; i < width; i += interval) {
      points.push([i, func(i)]);
    }

    if (this.state.intervalHandle) {
      clearInterval(this.state.intervalHandle);
    }

    const intervalHandle = setInterval(() => this.iterate(), 2e3);
    this.setState({
      points,
      intervalHandle,
      keep: null,
      discard: null,
      kept: null,
      lines: null,
      textInfo: null,
    });
  }

  iterate() {
    const threshold = this.props.threshold;
    const points = this.state.points.filter((p, i) => i % 2 === 0);
    const decide = this.state.points.filter((p, i) => i % 2 === 1);
    const keep = [];
    const discard = [];
    const lines = [];

    decide.forEach((deciding, ind) => {
      let shouldKeep = true;
      let mid;

      const pa = points[ind];
      const pb = points[ind + 1];

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

    this.setState({
      points,
      keep,
      discard,
      kept: (this.state.kept || []).concat(keep).sort((a, b) => b[0] - a[0]),
      lines,
    });

    if (points.length <= 2) {
      clearInterval(this.state.intervalHandle);
      setTimeout(() => this.afterIterating(), 2e3);
    }
  }

  afterIterating() {
    const points = this.state.points.concat(this.state.kept).sort((a, b) => b[0] - a[0]);
    const textInfo = `${Math.round(100 * (1 - (points.length / this.props.sampleCount)))}% (${points.length}/${this.props.sampleCount}, ${this.props.threshold})`;

    this.setState({
      points,
      keep: null,
      discard: null,
      kept: null,
      lines: null,
      textInfo,
    });

    setTimeout(() => this.initialize(), 6e3);
  }

  render() {
    const { height } = this.props;

    if (!this.state.points) {
      return null;
    }

    return (
      <g>
        {
          this.state.textInfo ? (
            <text
              x="0"
              y="12"
              fontFamily="Ariel"
              fontSize="12"
            >
              {this.state.textInfo}
            </text>
          ) : (
            null
          )
        }
        {this.state.lines && this.state.lines.map(l => (
          <polyline
            key={`deciding-line-${l[0][0]}`}
            points={`${l[0][0]}, ${height - l[0][1]} ${l[1][0]}, ${height - l[1][1]}`}
            stroke={l[2] ? 'red' : 'yellow'}
            fill="none"
          />
        ))}

        {this.state.kept && this.state.kept.map(p => (
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
        {this.state.kept && this.state.kept.map(p => (
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

        {this.state.discard && this.state.discard.map(p => (
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
        {this.state.discard && this.state.discard.map(p => (
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

        {this.state.keep && this.state.keep.map(p => (
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
        {this.state.keep && this.state.keep.map(p => (
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

        {this.state.points.map(p => (
          <circle
            key={`points-${p[0]}`}
            cx={p[0]}
            cy={height - p[1]}
            title={`(${p[0]}, ${p[1]})`}
            r="3"
            stroke="blue"
            fill="blue"
          />
        ))}
        {this.state.points.map((p1, ind, arr) => {
          const p2 = arr[ind + 1];
          if (!p2) {
            return null;
          }

          return (
            <polyline
              key={`point-line-${p1[0]}`}
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
