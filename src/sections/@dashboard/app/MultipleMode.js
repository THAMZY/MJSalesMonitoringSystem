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
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  styled,
  Tooltip,
  Fab,
} from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// components
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getMaintenanceDate } from '../../../data/maintenance/maintenance';
import Iconify from '../../../components/iconify';
// sections
import { SalesChart, SalesWidgetSummary, CompanyInfo } from '.';

import { getCompanyName, getAllCompanyChartData } from '../../../data/dashboard/dashboard';
import Loader from '../../../components/loader/Loader';

// ----------------------------------------------------------------------

export default function MultipleMode() {
  const [transition, setTransition] = useState(true);

  const handleTransitionChange = () => {
    setTransition(!transition);

    Swal.fire({
      icon: 'success',
      title: !transition === true ? 'Transition On' : 'Transition Off',
      html: '',
      timer: 2500,
      showCancelButton: false,
      showConfirmButton: false,
      position: 'center',
    });
  };

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
  const [distinctCompanyName, setDistinctCompanyName] = useState([]);

  const [companyChartDataList, setCompanyChartDataList] = useState([]);

  const [currentScrollView, setCurrentScrollView] = useState(0);

  useEffect(() => {
    CheckMaintenance();
    const getCompanyNameFunc = async () => {
      const distinctCompanyNameData = await getCompanyName();

      setDistinctCompanyName(distinctCompanyNameData);

      setFetchDataFlag(true);
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

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (fetchDataFlag === true) {
      CheckMaintenance();

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

          const discreteArr = [];
          input.chart_sales_revenue.map((val, index) => {
            const target = !Number.isNaN(input.chart_target_revenue[index] ?? NaN)
              ? Number(input.chart_target_revenue[index])
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

          return { ...input, chart_sales_revenue: newCSR, chart_target_revenue: newCTR, markerDiscrete: discreteArr };
        });

        setCompanyChartDataList(newGetAllCompanyChartValue);

        setIsLoading(false);
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

        setIsLoading(false);
      });
    }
  }, [fetchDataFlag]);

  let timer;

  const proceedNextScrollSection = (index, transition) => {
    const violation = document.getElementById(`section_${companyChartDataList[index].chart_company_id}`);

    if (transition === true) {
      timer =
        !timer &&
        setInterval(() => {
          if (violation) {
            window.scrollTo({
              top: violation.offsetTop - 50,
              behavior: 'smooth',
            });

            setCurrentScrollView(index + 1);
          }
        }, 8000);
    } else {
      clearInterval(timer);
    }
  };

  useEffect(() => {
    if (isLoading === false) {
      const maxArrayIndex = companyChartDataList.length - 1;

      if (currentScrollView > maxArrayIndex) {
        proceedNextScrollSection(0, transition);
      } else {
        proceedNextScrollSection(currentScrollView, transition);
      }
    }
    return () => clearInterval(timer);
  }, [isLoading, currentScrollView, transition]);

  return (
    <>
      {/* <Loader spinner={isLoading} /> */}

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <Skeleton variant="rectangular" height={525} />
            </Card>

            <Card sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" height={525} />
            </Card>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {companyChartDataList.map((input, ItemIndex) => (
              <Grid key={input.chart_company_id} id={`section_${input.chart_company_id}`} item xs={12} md={12} lg={12}>
                <SalesChart
                  height={400}
                  title={input.chart_company_id !== -9999 ? `${input.chart_company_name} Sales` : `Total Company Sales`}
                  subheader={input.chart_date_range}
                  chartLabels={input.chart_date_list}
                  markerDiscrete={input.markerDiscrete}
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
          <Tooltip
            title={
              transition ? (
                <Typography variant="subtitle1">Disable Transition</Typography>
              ) : (
                <Typography variant="subtitle1">Enable Transition</Typography>
              )
            }
          >
            <Fab
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
              color={'primary'}
              onClick={() => handleTransitionChange()}
            >
              <Iconify icon={transition ? 'ic:baseline-pause' : 'ri:play-fill'} width={30} />
            </Fab>
          </Tooltip>
          {/* <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={
              <SpeedDialIcon
                icon={<Iconify icon="ant-design:setting-filled" width={25} />}
                openIcon={<Iconify icon="material-symbols:close" width={25} />}
              />
            }
          >
            <SpeedDialAction
              key={'stopAutoScroll'}
              icon={<Iconify icon="material-symbols:auto-read-pause-outline" />}
              tooltipTitle={'Disable transition'}
              tooltipOpen
            />
          </SpeedDial> */}
        </>
      )}
    </>
  );
}
