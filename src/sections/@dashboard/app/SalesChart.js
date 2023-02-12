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
  height: PropTypes.number,
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  markerDiscrete: PropTypes.array,
};

export default function SalesChart({ title, subheader, chartLabels, chartData, markerDiscrete, height, ...other }) {
  const chartOptions = useChart({
    dataLabels: {
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.8,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45,
        },
      },
      offsetY: -20,
      offsetX: 0,
      enabled: true,
      enabledOnSeries: [1],
      textAnchor: 'middle',
      distributed: false,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        // return `${w.config.series[seriesIndex].name}:  ${value}`;

        const targetSales = Number.isNaN(w.config.series[0].data[dataPointIndex])
          ? 0
          : Number(w.config.series[0].data[dataPointIndex]);
        const ActualSales = Number.isNaN(w.config.series[1].data[dataPointIndex])
          ? 0
          : Number(w.config.series[1].data[dataPointIndex]);

        let labelValue = value;

        if (Number.isNaN(labelValue) === true) {
          return '';
        }

        if (ActualSales >= targetSales) {
          if (seriesIndex === 1) {
            labelValue = `${fShortenNumber(labelValue)}`;
            return `RM ${labelValue}`;
          }
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
      offsetX: 0,
      offsetY: 0,
      colors: undefined,
      radius: 2,
      discrete: markerDiscrete ?? [],
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: false,
    },
    colors: ['#546E7A', '#feb019', '#546E7A', '#E91E63', '#66DA26'],
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          // position: 'bottom',
        },
      },
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
      followCursor: true,
      shared: false,
      intersect: true,
      marker: { show: true },
      onDatasetHover: {
        highlightDataSeries: false,
      },
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
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={height} />
      </Box>
    </Card>
  );
}
