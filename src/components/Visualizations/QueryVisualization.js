import React from 'react';
import { Box } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

function QueryVisualization({ data, type = 'bar' }) {
  if (!data || data.length === 0) return null;

  const commonProps = {
    data: data,
    margin: { top: 50, right: 130, bottom: 50, left: 60 },
    animate: true,
  };

  switch (type) {
    case 'pie':
      return (
        <Box sx={{ height: 400 }}>
          <ResponsivePie
            {...commonProps}
            data={data.map(d => ({
              id: Object.values(d)[0],
              value: Object.values(d)[1]
            }))}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
              }
            ]}
          />
        </Box>
      );
    case 'line':
      return (
        <Box sx={{ height: 400 }}>
          <ResponsiveLine
            {...commonProps}
            data={[
              {
                id: "series",
                data: data.map((d, i) => ({
                  x: Object.values(d)[0],
                  y: Object.values(d)[1]
                }))
              }
            ]}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear' }}
            pointSize={10}
            useMesh={true}
          />
        </Box>
      );
    default:
      return (
        <Box sx={{ height: 400 }}>
          <ResponsiveBar
            {...commonProps}
            keys={[Object.keys(data[0])[1]]}
            indexBy={Object.keys(data[0])[0]}
            padding={0.3}
            labelSkipWidth={12}
            labelSkipHeight={12}
          />
        </Box>
      );
  }
}

export default QueryVisualization; 