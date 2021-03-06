import { DateTime } from 'luxon';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { GraphTab } from '.';
import SmartDate from '../../../shared/components/SmartDate';

interface BarChartProps {
  graphData: any[];
  graphTab: GraphTab;
}

// // https://recharts.org/en-US/examples/CustomizedLabelLineChart
const DateTick: React.FC<any> = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor='end' fill='#666'>
        <SmartDate includeTime={false}>{payload.value}</SmartDate>
      </text>
    </g>
  );
};

const DynamicBarChart: React.FC<BarChartProps> = ({ graphData, graphTab }) => {
  // Switch the 'mergeRequestCount', 'mergeRequestScore' and 'issueWordCount' into
  // negative  values so they are showing as downwards bars in the contribution graph
  for (const x in graphData) {
    graphData[x].mergeRequestCount = -graphData[x].mergeRequestCount;
    graphData[x].mergeRequestScore = -graphData[x].mergeRequestScore;
    graphData[x].issueWordCount = -graphData[x].issueWordCount;
  }
  if (graphTab === GraphTab.code) {
    return (
      <ResponsiveContainer width={900} height={600}>
        <BarChart stackOffset='sign' data={graphData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' tick={DateTick} />
          <YAxis
            tickFormatter={(value) => Math.abs(value).toString()}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <ReferenceLine y={0} stroke='#000' />
          <Tooltip
            labelFormatter={(value) =>
              DateTime.fromISO(value).toFormat('LLL dd yyyy')
            }
            formatter={(value) => Math.abs(value).toString()}
          />
          <Legend layout='horizontal' align='right' verticalAlign='top' />
          <Bar dataKey='commitCount' name='Commit' stackId='a' fill='#0A4D63' />
          <Bar
            dataKey='mergeRequestCount'
            name='Merge Request'
            stackId='a'
            fill='#e37500'
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (graphTab === GraphTab.scores) {
    return (
      <ResponsiveContainer width={900} height={600}>
        <BarChart stackOffset='sign' data={graphData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' tick={DateTick} />
          <YAxis
            tickFormatter={(value) => Math.round(Math.abs(value)).toString()}
            label={{ value: 'Point', angle: -90, position: 'insideLeft' }}
          />
          <ReferenceLine y={0} stroke='#000' />
          <Tooltip
            labelFormatter={(value) =>
              DateTime.fromISO(value).toFormat('LLL dd yyyy')
            }
            formatter={(value) => Math.abs(value).toFixed(1)}
          />
          <Legend layout='horizontal' align='right' verticalAlign='top' />
          <Bar dataKey='commitScore' name='Commit' stackId='a' fill='#0A4D63' />
          <Bar
            dataKey='mergeRequestScore'
            name='Merge Request'
            stackId='a'
            fill='#e37500'
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width={900} height={600}>
        <BarChart stackOffset='sign' data={graphData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' tick={DateTick} />
          <YAxis
            tickFormatter={(value) => Math.abs(value).toString()}
            label={{ value: 'Word Count', angle: -90, position: 'insideLeft' }}
          />
          <ReferenceLine y={0} stroke='#000' />
          <Tooltip
            labelFormatter={(value) =>
              DateTime.fromISO(value).toFormat('LLL dd yyyy')
            }
            formatter={(value) => Math.abs(value).toString()}
          />
          <Legend layout='horizontal' align='right' verticalAlign='top' />
          <Bar
            dataKey='issueWordCount'
            name='Issue'
            stackId='a'
            fill='#0A4D63'
          />
          <Bar
            dataKey='mergeRequestWordCount'
            name='Merge Request'
            stackId='a'
            fill='#e37500'
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
};

export default DynamicBarChart;
