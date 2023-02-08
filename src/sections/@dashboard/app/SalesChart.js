/* eslint-disable no-bitwise */
/* eslint-disable use-isnan */
import PropTypes, { arrayOf } from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

SalesChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function SalesChart({ title, subheader, chartLabels, chartData, ...other }) {
  const chartOptions = useChart({
    // points: [
    //   {
    //     x: new Date('01 Dec 2017').getTime(),
    //     y: 8607.55,
    //     marker: {
    //       size: 8,
    //     },
    //     label: {
    //       borderColor: '#FF4560',
    //       text: 'Point Annotation',
    //     },
    //   },
    // ],
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 8800,
    //       borderColor: '#00E396',
    //       label: {
    //         borderColor: '#00E396',
    //         style: {
    //           color: '#fff',
    //           background: '#00E396',
    //         },
    //         text: 'Y-axis annotation on 8800',
    //       },
    //     },
    //   ],
    // },
    dataLabels: {
      offsetX: 0,
      offsetY: -20,
      enabled: true,
      enabledOnSeries: false,
      textAnchor: 'middle',
      distributed: false,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        // return `${w.config.series[seriesIndex].name}:  ${value}`;

        let labelValue = value;

        if (Number.isNaN(labelValue) === true) {
          return '';
        }

        labelValue = fShortenNumber(labelValue);

        return `RM ${labelValue}`;
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: undefined,
      },
    },
    markers: {
      size: 6,
      colors: undefined,
      strokeColors: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: false,
      hover: {
        size: undefined,
        sizeOffset: 2,
      },
    },
    colors: ['#76B2BA', '#66DA26', '#546E7A', '#E91E63', '#2E93fA'],
    plotOptions: {
      bar: { columnWidth: '16%' },
    },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    legend: {
      fontSize: '14px',
      position: 'bottom',
      horizontalAlign: 'center',
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
        formatter: (value) => {
          let labelValue = value;

          labelValue = fShortenNumber(labelValue);

          return `RM ${labelValue}`;
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
      theme: 'dark',
      shared: false,
      intersect: true,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined' && Number.isNaN(y) !== true) {
            let labelValue = y;

            labelValue = fShortenNumber(labelValue);

            return `RM ${labelValue}`;
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
