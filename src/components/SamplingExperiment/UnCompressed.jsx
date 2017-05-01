import React, { PropTypes } from 'react';

const logColors = [
  // 'Black',
  'Navy',
  'DarkBlue',
  'MediumBlue',
  'Blue',
  'DarkGreen',
  'Green',
  'Teal',
  'DarkCyan',
  'DeepSkyBlue',
  'DarkTurquoise',
  'MediumSpringGreen',
  'Lime',
  'SpringGreen',
  'Aqua',
  'Cyan',
  'MidnightBlue',
  'DodgerBlue',
  'LightSeaGreen',
  'ForestGreen',
  'SeaGreen',
  'DarkSlateGray',
  'DarkSlateGrey',
  'LimeGreen',
  'MediumSeaGreen',
  'Turquoise',
  'RoyalBlue',
  'SteelBlue',
  'DarkSlateBlue',
  'MediumTurquoise',
  'Indigo',
  'DarkOliveGreen',
  'CadetBlue',
  'CornflowerBlue',
  'RebeccaPurple',
  'MediumAquaMarine',
  'DimGray',
  'DimGrey',
  'SlateBlue',
  'OliveDrab',
  'SlateGray',
  'SlateGrey',
  'LightSlateGray',
  'LightSlateGrey',
  'MediumSlateBlue',
  'LawnGreen',
  'Chartreuse',
  'Aquamarine',
  'Maroon',
  'Purple',
  'Olive',
  'Gray',
  'Grey',
  'SkyBlue',
  'LightSkyBlue',
  'BlueViolet',
  'DarkRed',
  'DarkMagenta',
  'SaddleBrown',
  'DarkSeaGreen',
  'LightGreen',
  'MediumPurple',
  'DarkViolet',
  'PaleGreen',
  'DarkOrchid',
  'YellowGreen',
  'Sienna',
  'Brown',
  'DarkGray',
  'DarkGrey',
  'LightBlue',
  'GreenYellow',
  'PaleTurquoise',
  'LightSteelBlue',
  'PowderBlue',
  'FireBrick',
  'DarkGoldenRod',
  'MediumOrchid',
  'RosyBrown',
  'DarkKhaki',
  'Silver',
  'MediumVioletRed',
  'IndianRed',
  'Peru',
  'Chocolate',
  'Tan',
  'LightGray',
  'LightGrey',
  'Thistle',
  'Orchid',
  'GoldenRod',
  'PaleVioletRed',
  'Crimson',
  'Gainsboro',
  'Plum',
  'BurlyWood',
  'LightCyan',
  'Lavender',
  'DarkSalmon',
  'Violet',
  'PaleGoldenRod',
  'LightCoral',
  'Khaki',
  'AliceBlue',
  'HoneyDew',
  'Azure',
  'SandyBrown',
  'Wheat',
  'Beige',
  'WhiteSmoke',
  'MintCream',
  'GhostWhite',
  'Salmon',
  'AntiqueWhite',
  'Linen',
  'LightGoldenRodYellow',
  'OldLace',
  'Red',
  'Fuchsia',
  'Magenta',
  'DeepPink',
  'OrangeRed',
  'Tomato',
  'HotPink',
  'Coral',
  'DarkOrange',
  'LightSalmon',
  'Orange',
  'LightPink',
  'Pink',
  'Gold',
  'PeachPuff',
  'NavajoWhite',
  'Moccasin',
  'Bisque',
  'MistyRose',
  'BlanchedAlmond',
  'PapayaWhip',
  'LavenderBlush',
  'SeaShell',
  'Cornsilk',
  'LemonChiffon',
  'FloralWhite',
  'Snow',
  'Yellow',
  'LightYellow',
  'Ivory',
  'White',
];

function UnCompressed({ compressed, height, debug }) {
  if (!compressed) {
    return null;
  }

  const pointsMap = {};
  let logColorIndex = 0;

  // to avoid things like 480.3999999999999 and 480.4 both being set
  function setPoint(point, skipIfSet) {
    const index = Math.round(point[0] * 1e6) / 1e6;
    if (skipIfSet && pointsMap[index]) {
      return;
    }
    pointsMap[index] = point;
  }

  compressed.forEach((set, setIndex) => {
    set.forEach((p) => { setPoint(p); });

    // don't extrapolate an extra set of data
    if (!compressed[setIndex + 1]) {
      return;
    }

    Object
      .keys(pointsMap)
      .map(k => pointsMap[k])
      .sort((a, b) => a[0] - b[0])
      .forEach((pa, i, arr) => {
        const pb = arr[i + 1];
        if (!pb) {
          return;
        }

        const mid = [
          (pa[0] + pb[0]) / 2,
          (pa[1] + pb[1]) / 2,
        ];
        if (debug) {
          mid.push({ pa, pb, color: logColors[logColorIndex] });
          logColorIndex += 1;
        }
        setPoint(mid, true);
      });
  });

  const fullPoints = Object
    .keys(pointsMap)
    .map(k => pointsMap[k])
    .sort((a, b) => a[0] - b[0]);

  return (
    <g>
      {fullPoints.map(p => (
        <circle
          key={`point-${p[0]}`}
          cx={p[0]}
          cy={height - p[1]}
          r="3"
          stroke="brown"
          fill="none"
        />
      ))}
      {fullPoints.map((p, i, a) => {
        const pa = a[i];
        const pb = a[i + 1];

        if (!pb) {
          return null;
        }

        return (
          <polyline
            key={`line-${pa[0]}`}
            points={`${pa[0]}, ${height - pa[1]} ${pb[0]}, ${height - pb[1]}`}
            stroke="brown"
            fill="none"
          />
        );
      })}
      {fullPoints
        .filter(l => !!l[2])
        .map(l => (
          <g key={`log-${l[0]}`}>
            <polyline
              points={`${l[2].pa[0]}, ${height - l[2].pa[1]} ${l[2].pb[0]}, ${height - l[2].pb[1]}`}
              stroke={l[2].color || 'black'}
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx={l[0]}
              cy={height - l[1]}
              r="2"
              stroke={l[2].color || 'black'}
              fill={l[2].color || 'black'}
            />
            <circle
              cx={l[2].pa[0]}
              cy={height - l[2].pa[1]}
              r="2"
              stroke={l[2].color || 'black'}
              fill={l[2].color || 'black'}
            />
            <circle
              cx={l[2].pb[0]}
              cy={height - l[2].pb[1]}
              r="2"
              stroke={l[2].color || 'black'}
              fill={l[2].color || 'black'}
            />
          </g>
        ))
      }
    </g>
  );
}

UnCompressed.propTypes = {
  compressed: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
  height: PropTypes.number.isRequired,
  debug: PropTypes.bool,
};

UnCompressed.defaultProps = {
  compressed: null,
  debug: false,
};

export default UnCompressed;
