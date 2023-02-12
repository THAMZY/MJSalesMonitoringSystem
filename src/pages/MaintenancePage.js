/* eslint-disable no-var */
/* eslint-disable prefer-arrow-callback */
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { getMaintenanceDate } from '../data/maintenance/maintenance';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function MaintenancePage() {
  const navigate = useNavigate();

  function CheckMaintenance() {
    const getMaintenanceDateFunc = async () => {
      const maintenanceDateData = await getMaintenanceDate();

      const maintenanceCookies = Cookies.get('maintenance') === undefined ? '' : Cookies.get('maintenance');

      if ((maintenanceDateData.desc ?? '') !== maintenanceCookies) {
        Cookies.set('maintenance', maintenanceDateData.desc ?? '', {
          path: '/',
          expires: new Date(2147483647 * 1000),
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'New Update Available',
        html: 'Page will refresh now.',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false,
        position: 'center',
      }).then(() => {
        navigate('/dashboard/app', { replace: true });
      });
    };

    getMaintenanceDateFunc().catch((error) => {
      if (error !== 503) {
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

  useEffect(() => {
    CheckMaintenance();
  }, []);

  return (
    <>
      <Helmet>
        <title> Under Maintenance</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            We&rsquo;ll be back soon!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. we&rsquo;ll be back
            online shortly!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>You may refresh to see if the system is back online.</Typography>
          <Typography sx={{ color: 'text.secondary' }}>&mdash; IT Team</Typography>

          <Box
            component="img"
            src="/assets/illustrations/maintenance_01.png"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
        </StyledContent>
      </Container>
    </>
  );
}
