/* eslint-disable prefer-template */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { Link as RouterLink } from 'react-router-dom';
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
  Button,
  OutlinedInput,
  Card,
  CardContent,
  CardActions,
  Stack,
  IconButton,
  styled,
} from '@mui/material';

// components
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { isNaN, isNumber } from 'lodash';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Iconify from '../components/iconify/Iconify';
import { updateCompanyChartDetails, viewCompanyChartDetails } from '../data/update-chart/update-chart';

// ----------------------------------------------------------------------

const NoMaxWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

export default function UpdateChartPage() {
  const [distinctValues, setDistinctValues] = useState({
    company_id: '',
    company_name: '',
  });

  const [companyChartDataList, setCompanyChartDataList] = useState([]);

  const [updatedCompanyChartDataList, setUpdatedCompanyChartDataList] = useState([]);

  useEffect(() => {
    let cookieCompanyId = Cookies.get('MJSMS_user_acc');

    if (cookieCompanyId !== null && cookieCompanyId !== undefined) {
      const viewCompanyChartDetailsFunc = async () => {
        const viewCompanyChartDetailsData = await viewCompanyChartDetails(Number(cookieCompanyId));

        if (viewCompanyChartDetailsData.length > 0) {
          setDistinctValues({
            ...distinctValues,
            company_id: cookieCompanyId,
            company_name: viewCompanyChartDetailsData.find((f) => f.company_id === Number(cookieCompanyId))
              .company_name,
          });
        }

        setCompanyChartDataList(viewCompanyChartDetailsData);
      };

      viewCompanyChartDetailsFunc().catch((error) => {
        Swal.fire({
          title: 'Fetch API failed',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      });
    }
  }, []);

  const companyChartDataColumn = [
    {
      field: 'sales_year',
      headerName: 'Year',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => `${params.row.sales_year}`,
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'sales_month',
      headerName: 'Month',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => `${params.row.sales_month}`,
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'target_revenue',
      headerName: 'Target Sales (RM)',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      valueGetter: (params) => `${params.row.target_revenue ?? '-'}`,
      minWidth: 250,
      sortable: false,
      editable: true,
    },
    {
      field: 'sales_revenue',
      headerName: 'Actual Sales (RM)',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      valueGetter: (params) => `${params.row.sales_revenue ?? '-'}`,
      minWidth: 250,
      sortable: false,
      editable: true,
    },
  ];

  const processRowUpdateFunc = (newRow, oldRow) => {
    if (newRow.sales_revenue != null) {
      if (isNaN(Number(newRow.sales_revenue)) && newRow.sales_revenue.toString().trim() !== '-') {
        Swal.fire({
          title: 'Invalid Actual Sales',
          text: 'Only "-" or digits are allowed.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });

        return oldRow;
      }
    }
    if (newRow.target_revenue != null) {
      if (isNaN(Number(newRow.target_revenue)) && newRow.target_revenue.toString().trim() !== '-') {
        Swal.fire({
          title: 'Invalid Target Sales',
          text: 'Only "-" or digits are allowed.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });

        return oldRow;
      }
    }

    if (newRow.sales_revenue != null) {
      newRow.sales_revenue =
        !isNaN(Number(newRow.sales_revenue)) && newRow.sales_revenue.toString().trim().length !== 0
          ? Number(newRow.sales_revenue)
          : null;
    }

    if (newRow.target_revenue != null) {
      newRow.target_revenue =
        !isNaN(Number(newRow.target_revenue)) && newRow.target_revenue.toString().trim().length !== 0
          ? Number(newRow.target_revenue)
          : null;
    }

    let updatedRow = { ...newRow };

    if (companyChartDataList.find((f) => f.id === oldRow.id).sales_revenue !== newRow.sales_revenue) {
      setUpdatedCompanyChartDataList((oldArray) => [...oldArray, { ...newRow }]);
    } else {
      let myObjectToUpdate = updatedCompanyChartDataList.filter((f) => f.id !== newRow.id);
      setUpdatedCompanyChartDataList(myObjectToUpdate);
    }

    let newList = [];
    if (
      companyChartDataList.find((f) => f.id === oldRow.id).target_revenue === newRow.target_revenue &&
      companyChartDataList.find((f) => f.id === oldRow.id).sales_revenue === newRow.sales_revenue
    ) {
      newList = updatedCompanyChartDataList.filter((f) => f.id !== newRow.id);
    } else {
      if (updatedCompanyChartDataList.filter((f) => f.id === oldRow.id).length > 0) {
        newList = updatedCompanyChartDataList.map((c, i) => {
          if (c.id === oldRow.id) {
            if (c.target_revenue !== newRow.target_revenue) {
              return { ...c, target_revenue: newRow.target_revenue };
            }

            if (c.sales_revenue !== newRow.sales_revenue) {
              return { ...c, sales_revenue: newRow.sales_revenue };
            }
          }

          return c;
        });
      } else {
        newList = updatedCompanyChartDataList;
        newList.push({ ...newRow });
      }
    }

    setUpdatedCompanyChartDataList(newList);

    return updatedRow;
  };

  const dataGridSizeOption = {
    marginTop: '20px',
    width: '100%',
  };

  const dataGridOption = {
    autoHeight: true,
    experimentalFeatures: { newEditingApi: true },
    processRowUpdate: processRowUpdateFunc,
    onProcessRowUpdateError: (e) => console.log(e),
    hideFooter: true,
    checkboxSelection: false,
    disableSelectionOnClick: true,
    disableColumnFilter: true,
    disableColumnMenu: true,
    sx: {
      backgroundColor: 'white',
      '&.MuiDataGrid-root .MuiDataGrid-columnHeader': {
        outline: 'none !important',
      },
      '& .MuiDataGrid-row:hover': {
        cursor: 'pointer',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'rgba(249, 247, 247 )',
      },
    },
    components: {},
    componentsProps: {
      basePopper: {
        sx: {
          '& .MuiPaper-root': {
            boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    columns: companyChartDataColumn,
    rows: companyChartDataList,
  };

  const handleSubmit = (e) => {
    Swal.fire({
      title: 'Update Confirmation',
      html: 'You will not able to revert changes after the update.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        updateCompanyChartDetails(updatedCompanyChartDataList)
          .then((response) => {
            if (response.Item1 === 'success') {
              Swal.fire({
                title: 'Update Successfully',
                html: 'The company chart data has been updated.',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then(() => {
                window.location.reload(false);
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: 'Fetch API failed',
              html: error,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            });
          });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title> Update Chart </title>
      </Helmet>

      <Container maxWidth="xl">
        <Card sx={{ borderRadius: '5px' }}>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '15px 25px 15px',
              borderBottom: '1px solid rgba(241, 243, 244, 1)',
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Iconify icon="material-symbols:edit-document-outline" sx={{ color: '#061B64' }} width={28} />
              <Typography variant="h5" sx={{ color: '#061B64' }}>
                UPDATE CHART
              </Typography>
            </Stack>
          </CardActions>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography sx={{ mx: 0.5, mb: 0.5 }} variant="subtitle1">
                  Company ID
                </Typography>
                <OutlinedInput
                  fullWidth
                  readOnly
                  id={'company_id'}
                  name={'company_id'}
                  value={distinctValues.company_id}
                  sx={{ borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography sx={{ mx: 0.5, mb: 0.5 }} variant="subtitle1">
                  Company Name
                </Typography>
                <OutlinedInput
                  fullWidth
                  readOnly
                  id={'company_name'}
                  name={'company_name'}
                  value={distinctValues.company_name}
                  sx={{ borderRadius: '5px' }}
                />
              </Grid>
            </Grid>

            <Box {...dataGridSizeOption}>
              <Stack direction="row" alignItems="center" gap={0}>
                <Typography variant="subtitle1" sx={{ color: '#061B64' }}>
                  How to edit :
                </Typography>
                <NoMaxWidthTooltip
                  title={
                    <Typography variant="subtitle2">
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Double-Click
                      </kbd>
                      {' / '}
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Click + Enter Value
                      </kbd>
                      {'  '}
                      : To edit a cell <br />
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Tab
                      </kbd>
                      {' / '}
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Enter
                      </kbd>
                      {' / '}
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Click outside the cell
                      </kbd>{' '}
                      : To save changes <br />
                      <kbd
                        style={{
                          border: '1px solid #1e4976',
                          padding: '5px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          lineHeight: '10px',
                        }}
                      >
                        Escape
                      </kbd>{' '}
                      : To undo changes
                    </Typography>
                  }
                >
                  <IconButton color="error" size="medium">
                    <Iconify icon="radix-icons:question-mark-circled" width="20" />
                  </IconButton>
                </NoMaxWidthTooltip>
              </Stack>

              <DataGrid {...dataGridOption} />
            </Box>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '10px 25px 10px',
              borderTop: '1px solid rgba(241, 243, 244, 1)',
            }}
          >
            <Button
              onClick={handleSubmit}
              size="medium"
              variant="outlined"
              startIcon={<Iconify icon="ic:outline-save" />}
            >
              SAVE
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
