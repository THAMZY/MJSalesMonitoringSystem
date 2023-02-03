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
} from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// components
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Iconify from '../../../components/iconify';
// sections
import { SalesChart, SalesWidgetSummary, CompanyInfo } from '.';
import {
  getCompanyName,
  getSalesDate,
  getSalesRevenue,
  getSummaryLatestSalesGrowth,
  getSummaryTargetAchieved,
  getSummaryTotalSalesRevenue,
  getSummaryTotalTargetRevenue,
  getTargetRevenue,
} from '../../../data/dashboard/dashboard';

// ----------------------------------------------------------------------

export default function SingleMode() {
  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  /* MODE 1 DECLARATION BEGIN */

  /* COMPANY LIST */
  const [companyName, setCompanyName] = useState([]);

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
    const getCompanyNameFunc = async () => {
      const companyNameData = await getCompanyName();

      setCompanyNameMaxLength(companyNameData.length - 1);

      setCompanyName(companyNameData);

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
    });
  }, []);

  let timer;

  const IncreaseCompanyNameTabCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setCurrentCompanyNameTabPosition((currentCompanyNameTabPosition) => currentCompanyNameTabPosition + 1);
      }, 5000);
  };

  useEffect(() => {
    if (fetchDataFlag === true) {
      if (stopCompanyNameTabPosition === false) {
        if (currentCompanyNameTabPosition < companyNameMaxLength) {
          IncreaseCompanyNameTabCount();
        } else if (currentCompanyNameTabPosition >= companyNameMaxLength) {
          setTimeout(() => {
            setCurrentCompanyNameTabPosition(0);
          }, 5000);
        }
      }
    }

    return () => clearInterval(timer);
  }, [fetchDataFlag, IncreaseCompanyNameTabCount]);

  useEffect(() => {
    if (fetchDataFlag === true) {
      const getSalesDateFunc = async () => {
        const salesDateData = await getSalesDate(companyName[currentCompanyNameTabPosition].company_id);

        setChartSubTitle(`${salesDateData[0]} - ${salesDateData[salesDateData.length - 1]}`);

        setSalesDateRange(salesDateData);
      };

      getSalesDateFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      const getSalesRevenueFunc = async () => {
        const salesRevenueData = await getSalesRevenue(companyName[currentCompanyNameTabPosition].company_id);

        const newSalesRevenueData = salesRevenueData.map((value) => {
          if (value === 0) {
            return NaN;
          }

          return value;
        });

        setCurrentCompanySalesRevenue(newSalesRevenueData);
      };

      getSalesRevenueFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      const getTargetRevenueFunc = async () => {
        const targetRevenueData = await getTargetRevenue(companyName[currentCompanyNameTabPosition].company_id);

        const newTargetRevenueData = targetRevenueData.map((value) => {
          if (value === 0) {
            return NaN;
          }

          return value;
        });

        setCurrentCompanyTargetRevenue(newTargetRevenueData);
      };

      getTargetRevenueFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      if (companyName[currentCompanyNameTabPosition].company_id === -9999) {
        setChartTitle('Total Company Sales');
      } else {
        setChartTitle(`${companyName[currentCompanyNameTabPosition].company_name} Sales`);
      }

      const getSummaryTotalSalesRevenueFunc = async () => {
        const summaryTotalSalesRevenueData = await getSummaryTotalSalesRevenue(
          companyName[currentCompanyNameTabPosition].company_id
        );

        setCurrentCompanyTotalSalesRevenue(summaryTotalSalesRevenueData);
      };

      getSummaryTotalSalesRevenueFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      const getSummaryTotalTargetRevenueFunc = async () => {
        const summaryTotalTargetRevenueData = await getSummaryTotalTargetRevenue(
          companyName[currentCompanyNameTabPosition].company_id
        );

        setCurrentCompanyTotalTargetRevenue(summaryTotalTargetRevenueData);
      };

      getSummaryTotalTargetRevenueFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      const getSummaryTargetAchievedFunc = async () => {
        const summaryTargetAchievedData = await getSummaryTargetAchieved(
          companyName[currentCompanyNameTabPosition].company_id
        );

        setCurrentCompanyTargetAchieved(summaryTargetAchievedData);
      };

      getSummaryTargetAchievedFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });

      const getSummaryLatestSalesGrowthFunc = async () => {
        const summaryLatestSalesGrowthData = await getSummaryLatestSalesGrowth(
          companyName[currentCompanyNameTabPosition].company_id
        );

        setCurrentCompanyLatestSalesGrowth(summaryLatestSalesGrowthData);
      };

      getSummaryLatestSalesGrowthFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });
    }
  }, [fetchDataFlag, currentCompanyNameTabPosition]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <SalesChart
            title={chartTitle}
            subheader={chartSubTitle}
            chartLabels={salesDateRange}
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

        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>
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
