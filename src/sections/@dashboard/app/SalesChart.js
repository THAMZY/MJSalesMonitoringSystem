import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

SalesChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function SalesChart({ title, subheader, chartLabels, chartData, ...other }) {
  const chartOptions = useChart({
    colors: ['#66DA26', '#2E93fA', '#546E7A', '#E91E63', '#FF9800'],
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    legend: {
      fontSize: '14px',
    },
    xaxis: {
      tickPlacement: 'between',
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
      tooltip: {
        style: {
          fontSize: '16px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    stroke: {
      curve: 'smooth',
    },
    chart: {
      animations: {
        enabled: true,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined' && Number.isNaN(y) !== true) {
            return `RM ${y.toFixed(0)}`;
          }

          return y;
        },
      },
      style: {
        fontSize: '14px',
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
