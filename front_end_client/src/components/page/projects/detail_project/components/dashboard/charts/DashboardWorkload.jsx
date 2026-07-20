import { Card, CardContent, Stack, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DashboardWorkloadTooltip = ({ active, payload, label }) => {
  const data = payload?.[0]?.payload;

  return (
    <Card
      sx={{
        minWidth: 100,
      }}
    >
      <CardContent>
        <Stack
          sx={{
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {data?.assignee}
          </Typography>
          <Stack direction={'row'} sx={{ gap: 1 }}>
            <Typography>{data?.taskCount ?? 0}</Typography>
            <Typography>Task</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const DashboardWorkload = ({ data }) => {
  return (
    <AreaChart
      style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '70vh',
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
    >
      <defs>
        <linearGradient id="colorTaskCount" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={'5%'} stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset={'95%'} stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray={'3 3'} />
      <XAxis dataKey={'assignee'} />
      <YAxis
        width={'auto'}
        label={{
          value: 'Total task',
          angle: -90,
          position: 'insideLeft',
          textAnchor: 'middle',
        }}
       />
      <Tooltip
        content={DashboardWorkloadTooltip}
        isAnimationActive={true}
       />
      <Area
        type={'monotone'}
        dataKey={'taskCount'}
        stroke="#82ca9d"
        fillOpacity={1}
        fill="url(#colorTaskCount)"
        isAnimationActive={true}
       />
    </AreaChart>
  );
};

export default DashboardWorkload;
