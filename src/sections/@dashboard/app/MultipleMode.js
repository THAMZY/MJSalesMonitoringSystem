/* eslint-disable react-hooks/exhaustive-deps */

import {
  Grid,
  Container,
  Typography,
  Box,
  Tab,
  AppBar,
  Toolbar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Skeleton,
  Card,
} from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// components
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Iconify from '../../../components/iconify';
// sections
import { SalesChart, SalesWidgetSummary, CompanyInfo } from '.';

import { getCompanyName, getAllCompanyChartData } from '../../../data/dashboard/dashboard';
import Loader from '../../../components/loader/Loader';

// ----------------------------------------------------------------------

export default function MultipleMode() {
  const [isLoading, setIsLoading] = useState(true);

  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  /* MODE 1 DECLARATION BEGIN */

  /* COMPANY LIST */
  const [distinctCompanyName, setDistinctCompanyName] = useState([]);

  const [companyChartDataList, setCompanyChartDataList] = useState([]);

  useEffect(() => {
    const getCompanyNameFunc = async () => {
      const distinctCompanyNameData = await getCompanyName();

      setDistinctCompanyName(distinctCompanyNameData);

      setFetchDataFlag(true);
    };

    getCompanyNameFunc().catch((error) => {
      Swal.fire({
        title: 'Fetch API failed',
        text: error,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (fetchDataFlag === true) {
      const getAllCompanyChartDataFunc = async () => {
        const getAllCompanyChartValue = await getAllCompanyChartData();

        const newGetAllCompanyChartValue = getAllCompanyChartValue.map((input) => {
          const newCSR = input.chart_sales_revenue.map((csr, csrIdx) => {
            if (csr === 0) {
              return NaN;
            }

            return csr;
          });

          const newCTR = input.chart_target_revenue.map((ctr, ctrIdx) => {
            if (ctr === 0) {
              return NaN;
            }

            return ctr;
          });

          return { ...input, chart_sales_revenue: newCSR, chart_target_revenue: newCTR };
        });

        setCompanyChartDataList(newGetAllCompanyChartValue);

        setIsLoading(false);
      };

      getAllCompanyChartDataFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });

        setIsLoading(false);
      });
    }
  }, [fetchDataFlag]);

  return (
    <>
      {/* <Loader spinner={isLoading} /> */}

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <Skeleton variant="rectangular" height={485} />
            </Card>

            <Card sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" height={485} />
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {companyChartDataList.map((input, ItemIndex) => (
            <Grid key={input.chart_company_id} item xs={12} md={12} lg={12}>
              <SalesChart
                title={input.chart_company_id !== -9999 ? `${input.chart_company_name} Sales` : `Total Company Sales`}
                subheader={input.chart_date_range}
                chartLabels={input.chart_date_list}
                chartData={[
                  {
                    name: 'Target Sales',
                    type: 'column',
                    fill: 'solid',
                    data: input.chart_target_revenue,
                  },
                  {
                    name: 'Actual Sales',
                    type: 'line',
                    fill: 'solid',
                    data: input.chart_sales_revenue,
                  },
                ]}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
