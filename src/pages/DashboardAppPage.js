/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
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

// components
import { useEffect, useState } from 'react';
import { MultipleMode, SingleMode } from '../sections/@dashboard/app';

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
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
          <Grid item>
            <FormControl>
              <RadioGroup value={modeValue} row name="mode-group" onChange={handleModeChange}>
                <FormControlLabel value="1" control={<Radio />} label="Single Mode" />
                <FormControlLabel value="2" control={<Radio />} label="Multiple Mode" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {modeValue === '1' && <SingleMode />}

        {modeValue === '2' && <MultipleMode />}
      </Container>
    </>
  );
}
