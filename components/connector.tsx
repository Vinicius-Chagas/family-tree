import { X } from '@/constants/consts';
import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';
import { Connector } from 'relatives-tree/lib/types';

interface Props {
  connector: Connector;
  index?: number; // Optional prop to indicate if this is the first connector
}

const linkIconPath = "M-6,0a3,3 0 1,0 12,0a3,3 0 1,0 -12,0M-2,0h4";
const iconSize = 6; // Approximate radius or half-width of the icon


export default React.memo<Props>(function Connector({ connector, index }) {
  console.log('Rendering Connector ' + index, connector);
const [x1g, y1g, x2g, y2g] = connector; // g for grid units

  const x1 = x1g * X;
  const y1 = y1g * X;
  const x2 = x2g * X;
  const y2 = y2g * X;

  const lineThickness = 4;
  const lineColor = '#7A8A99';

  // Calculate midpoint
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Calculate angle for rotation (optional)
  // Angle in degrees
  const angleRad = Math.atan2(y2 - y1, x2 - x1);
  const angleDeg = angleRad * (180 / Math.PI);

  // Determine if the line is primarily horizontal (for placing the link icon)
  // You might want a more sophisticated check or pass this info if available
  const isHorizontal = Math.abs(y1g - y2g) < 0.1 && Math.abs(x1g-x2g) > 0; // Check if y-coords are very close

  return (
    <Svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={lineColor}
        strokeWidth={lineThickness}
        strokeLinecap="round"
      />

      {/* Example: Add a circle in the middle */}
      {/* 
      <Circle
        cx={midX}
        cy={midY}
        r="5" // Radius of the circle
        fill="red"
      />
      */}

      {/* Example: Add a link icon in the middle of horizontal lines */}
      {isHorizontal && (
        <Path
          d={linkIconPath}
          fill="none"
          stroke={lineColor} // Or a different color for the icon
          strokeWidth={2} // Icon line thickness
          // Position the icon at the midpoint.
          // The transform translates the icon (drawn around 0,0) to the midpoint.
          // If your icon path is not drawn around 0,0, you'll need to adjust x, y or the transform.
          transform={`translate(${midX}, ${midY}) rotate(${angleDeg})`}
          // If you don't want rotation, just use:
          // x={midX - iconSize} y={midY - iconSize} (if icon is iconSize*2 wide/high)
          // or adjust translate if the icon's path isn't centered at 0,0
        />
      )}
    </Svg>
  );
});