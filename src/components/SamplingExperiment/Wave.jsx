import React, { PropTypes } from 'react';

const Wave = (props) => {
  const { width, height, func } = props;
  const points = [];

  // get rid of react warning about invalid props
  const polylineProps = Object.assign({}, props);
  delete polylineProps.func;
  delete polylineProps.sampleCount;

  for (let i = 1; i < width; i += 1) {
    points.push(`${i}, ${height - func(i)}`);
  }

  return (
    <polyline
      fill="none"
      stroke="black"
      {...polylineProps}
      points={points.join(' ')}
    />
  );
};

Wave.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired,
};

export default Wave;
