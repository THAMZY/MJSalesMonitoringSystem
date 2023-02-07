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
} from '@mui/material';

// components
import { useEffect, useState } from 'react';

import { MultipleMode, SingleMode } from '../sections/@dashboard/app';
import Iconify from '../components/iconify/Iconify';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [modeValue, setModeValue] = useState('1');

  const handleModeChange = (event) => {
    setModeValue(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 0.5 }}>
          <Grid item>
            <FormControl>
              <RadioGroup value={modeValue} row name="mode-group" onChange={handleModeChange}>
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={<Typography variant="body1">Single View</Typography>}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label={<Typography variant="body1">Multiple View</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component={RouterLink}
              to={'/'}
              startIcon={<Iconify icon="material-symbols:add" />}
            >
              UPDATE
            </Button>
          </Grid>
        </Grid>

        {modeValue === '1' && <SingleMode />}

        {modeValue === '2' && <MultipleMode />}
      </Container>
    </>
  );
}
