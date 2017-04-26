import React, { PropTypes } from 'react';

const Samples = (props) => {
  const { width, height, func, sampleCount } = props;
  const interval = (width - 1) / sampleCount;
  const points = [];

  for (let i = 1; i < width; i += interval) {
    points.push([i, height - func(i)]);
  }

  return (
    <g>
      {points.map(p => (
        <circle
          key={p[0]}
          cx={p[0]}
          cy={p[1]}
          r="1.5"
          stroke="green"
          fill="green"
        />
      ))}
    </g>
  );
};

Samples.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired,
  sampleCount: PropTypes.number.isRequired,
};

export default Samples;
