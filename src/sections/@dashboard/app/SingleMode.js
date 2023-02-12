/* eslint-disable react-hooks/exhaustive-deps */

// @mui

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
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Iconify from '../../../components/iconify';
// sections
import { SalesChart, SalesWidgetSummary, CompanyInfo } from '.';
import {
  getAllCompanyChartData,
  getCompanyName,
  getSalesDate,
  getSalesRevenue,
  getSummaryLatestSalesGrowth,
  getSummaryTargetAchieved,
  getSummaryTotalSalesRevenue,
  getSummaryTotalTargetRevenue,
  getTargetRevenue,
} from '../../../data/dashboard/dashboard';
import { getMaintenanceDate } from '../../../data/maintenance/maintenance';

// ----------------------------------------------------------------------

export default function SingleMode() {
  function CheckMaintenance() {
    const getMaintenanceDateFunc = async () => {
      const maintenanceDateData = await getMaintenanceDate();

      const maintenanceCookies = Cookies.get('maintenance') === undefined ? '' : Cookies.get('maintenance');

      if ((maintenanceDateData.desc ?? '') !== maintenanceCookies) {
        Cookies.set('maintenance', maintenanceDateData.desc ?? '', {
          path: '/',
          expires: new Date(2147483647 * 1000),
        });

        Swal.fire({
          icon: 'success',
          title: 'New Update Available',
          html: 'Page will refresh now.',
          timer: 2000,
          showCancelButton: false,
          showConfirmButton: false,
          position: 'center',
        }).then(() => {
          window.location.reload(true);
        });
      }
    };

    getMaintenanceDateFunc().catch((error) => {
      if (error === 503) {
        navigate('/maintenance', { replace: true });
      } else {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  /* MODE 1 DECLARATION BEGIN */

  /* COMPANY LIST */
  const [companyName, setCompanyName] = useState([]);
  const [companyChartDataList, setCompanyChartDataList] = useState([]);

  /* BOTTOM TAB INFO */
  const [currentCompanyNameTabPosition, setCurrentCompanyNameTabPosition] = useState(0);
  const [companyNameMaxLength, setCompanyNameMaxLength] = useState(0);
  const [stopCompanyNameTabPosition, setStopCompanyNameTabPosition] = useState(false);

  /* CHART INFO */
  const [chartTitle, setChartTitle] = useState('');
  const [chartSubTitle, setChartSubTitle] = useState('');
  const [salesDateRange, setSalesDateRange] = useState([]);
  const [currentCompanySalesRevenue, setCurrentCompanySalesRevenue] = useState([]);
  const [currentCompanyTargetRevenue, setCurrentCompanyTargetRevenue] = useState([]);
  const [currentChartMarkerDiscrete, setCurrentChartMarkerDiscrete] = useState([]);

  /* SUMMARY INFO */
  const [currentCompanyTotalSalesRevenue, setCurrentCompanyTotalSalesRevenue] = useState(0);
  const [currentCompanyTotalTargetRevenue, setCurrentCompanyTotalTargetRevenue] = useState(0);
  const [currentCompanyTargetAchieved, setCurrentCompanyTargetAchieved] = useState(0);
  const [currentCompanyLatestSalesGrowth, setCurrentCompanyLatestSalesGrowth] = useState(0);

  /* FUNCTION CALLED */
  const handleCompanyNameTabClick = () => {
    setStopCompanyNameTabPosition(true);
  };

  const handleCompanyNameTabChange = (event, newValue) => {
    setCurrentCompanyNameTabPosition(newValue);
  };

  /* MODE 1 DECLARATION END */

  useEffect(() => {
    CheckMaintenance();

    const getCompanyNameFunc = async () => {
      const companyNameData = await getCompanyName();

      setCompanyNameMaxLength(companyNameData.length - 1);

      setCompanyName(companyNameData);
    };

    getCompanyNameFunc().catch((error) => {
      if (error === 503) {
        navigate('/maintenance', { replace: true });
      } else {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }

      setFetchDataFlag(false);
    });

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

      setFetchDataFlag(true);
    };

    getAllCompanyChartDataFunc().catch((error) => {
      if (error === 503) {
        navigate('/maintenance', { replace: true });
      } else {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }

      setFetchDataFlag(false);
    });
  }, []);

  let timer;

  const IncreaseCompanyNameTabCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setCurrentCompanyNameTabPosition((currentCompanyNameTabPosition) => currentCompanyNameTabPosition + 1);
      }, 8000);
  };

  useEffect(() => {
    if (fetchDataFlag === true) {
      if (stopCompanyNameTabPosition === false) {
        if (currentCompanyNameTabPosition < companyNameMaxLength) {
          IncreaseCompanyNameTabCount();
        } else if (currentCompanyNameTabPosition >= companyNameMaxLength) {
          setTimeout(() => {
            setCurrentCompanyNameTabPosition(0);
          }, 8000);
        }
      }
    }

    return () => clearInterval(timer);
  }, [fetchDataFlag, IncreaseCompanyNameTabCount]);

  useEffect(() => {
    if (fetchDataFlag === true) {
      CheckMaintenance();

      const selectedCompanyChartData = companyChartDataList.find(
        (f) => f.chart_company_id === companyName[currentCompanyNameTabPosition].company_id
      );

      setChartSubTitle(selectedCompanyChartData.chart_date_range);

      setSalesDateRange(selectedCompanyChartData.chart_date_list);
      setCurrentCompanySalesRevenue(selectedCompanyChartData.chart_sales_revenue);

      setCurrentCompanyTargetRevenue(selectedCompanyChartData.chart_target_revenue);

      setChartTitle(
        selectedCompanyChartData.chart_company_id === -9999
          ? 'Total Company Sales'
          : `${selectedCompanyChartData.chart_company_name} Sales`
      );

      const discreteArr = [];
      selectedCompanyChartData.chart_sales_revenue.map((val, index) => {
        const target = !Number.isNaN(selectedCompanyChartData.chart_target_revenue[index] ?? NaN)
          ? Number(selectedCompanyChartData.chart_target_revenue[index])
          : NaN;

        const sales = !Number.isNaN(val) ? Number(val) : NaN;

        const color = sales >= target ? '#66DA26' : '#E91E63';

        discreteArr.push({
          seriesIndex: 1,
          dataPointIndex: index,
          fillColor: color,
          strokeColor: '#fff',
          size: 6,
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          shape: 'circle',
          hover: {
            size: undefined,
            sizeOffset: 3,
          },
        });

        return val;
      });

      setCurrentChartMarkerDiscrete(discreteArr);

      setIsLoading(false);

      // const getSummaryTotalSalesRevenueFunc = async () => {
      //   const summaryTotalSalesRevenueData = await getSummaryTotalSalesRevenue(
      //     companyName[currentCompanyNameTabPosition].company_id
      //   );

      //   setCurrentCompanyTotalSalesRevenue(summaryTotalSalesRevenueData);
      // };

      // getSummaryTotalSalesRevenueFunc().catch((error) => {
      //   if (error === 503) {
      //     navigate('/maintenance', { replace: true });
      //   } else {
      //     Swal.fire({
      //       title: 'Fetch API failed',
      //       text: error,
      //       icon: 'error',
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'OK',
      //     });
      //   }
      // });

      // const getSummaryTotalTargetRevenueFunc = async () => {
      //   const summaryTotalTargetRevenueData = await getSummaryTotalTargetRevenue(
      //     companyName[currentCompanyNameTabPosition].company_id
      //   );

      //   setCurrentCompanyTotalTargetRevenue(summaryTotalTargetRevenueData);
      // };

      // getSummaryTotalTargetRevenueFunc().catch((error) => {
      //   if (error === 503) {
      //     navigate('/maintenance', { replace: true });
      //   } else {
      //     Swal.fire({
      //       title: 'Fetch API failed',
      //       text: error,
      //       icon: 'error',
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'OK',
      //     });
      //   }
      // });

      // const getSummaryTargetAchievedFunc = async () => {
      //   const summaryTargetAchievedData = await getSummaryTargetAchieved(
      //     companyName[currentCompanyNameTabPosition].company_id
      //   );

      //   setCurrentCompanyTargetAchieved(summaryTargetAchievedData);
      // };

      // getSummaryTargetAchievedFunc().catch((error) => {
      //   if (error === 503) {
      //     navigate('/maintenance', { replace: true });
      //   } else {
      //     Swal.fire({
      //       title: 'Fetch API failed',
      //       text: error,
      //       icon: 'error',
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'OK',
      //     });
      //   }
      // });

      // const getSummaryLatestSalesGrowthFunc = async () => {
      //   const summaryLatestSalesGrowthData = await getSummaryLatestSalesGrowth(
      //     companyName[currentCompanyNameTabPosition].company_id
      //   );

      //   setCurrentCompanyLatestSalesGrowth(summaryLatestSalesGrowthData);
      // };

      // getSummaryLatestSalesGrowthFunc().catch((error) => {
      //   if (error === 503) {
      //     navigate('/maintenance', { replace: true });
      //   } else {
      //     Swal.fire({
      //       title: 'Fetch API failed',
      //       text: error,
      //       icon: 'error',
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'OK',
      //     });
      //   }
      // });
    }
  }, [fetchDataFlag, currentCompanyNameTabPosition]);

  return (
    <>
      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <Skeleton variant="rectangular" height={485} />
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} md={12} lg={12}>
            <SalesChart
              height={365}
              title={chartTitle}
              subheader={chartSubTitle}
              chartLabels={salesDateRange}
              markerDiscrete={currentChartMarkerDiscrete}
              chartData={[
                {
                  name: 'Target Sales',
                  type: 'column',
                  fill: 'solid',
                  data: currentCompanyTargetRevenue,
                },
                {
                  name: 'Actual Sales',
                  type: 'line',
                  fill: 'solid',
                  data: currentCompanySalesRevenue,
                },
              ]}
            />
          </Grid>
        )}

        {/* <Grid item xs={12} sm={6} md={3}>
          <SalesWidgetSummary
            type="number"
            title="Total Target Sales"
            total={currentCompanyTotalTargetRevenue}
            color="primary"
            icon={'foundation:target-two'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesWidgetSummary
            type="number"
            title="Total Actual Sales"
            total={currentCompanyTotalSalesRevenue}
            icon={'ri:money-dollar-circle-fill'}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesWidgetSummary
            type="percentage"
            title="Target Achieved"
            total={currentCompanyTargetAchieved}
            color="primary"
            icon={'mdi:target-arrow'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SalesWidgetSummary
            type="percentage"
            title="Latest Sales Growth"
            total={currentCompanyLatestSalesGrowth}
            color="primary"
            icon={'carbon:growth'}
          />
        </Grid> */}
      </Grid>

      <AppBar
        position="fixed"
        color="default"
        sx={{ top: 'auto', bottom: 0, boxShadow: '0px 0 10px rgba(0, 0, 0, 0.15)' }}
      >
        <Toolbar
          sx={{
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Tabs
              value={currentCompanyNameTabPosition}
              onClick={handleCompanyNameTabClick}
              onChange={handleCompanyNameTabChange}
              variant="scrollable"
              allowScrollButtonsMobile
              scrollButtons
              sx={{
                '& .MuiSvgIcon-root': { fontSize: '2rem' },
                [`& .${tabsClasses.scrollButtons}`]: {
                  '&.Mui-disabled': { opacity: 0.3 },
                },
              }}
            >
              {companyName.map((company, index) => (
                <Tab
                  key={company.company_id}
                  label={<Typography variant="h6">{company.company_name}</Typography>}
                  wrapped
                />
              ))}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
