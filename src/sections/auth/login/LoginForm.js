import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    user_id: '',
    password: '',
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleLogin = () => {
    const validUserAccount = [
      {
        user_id: '1001',
        password: '12345678',
      },
      {
        user_id: '1002',
        password: '12345678',
      },
      {
        user_id: '1003',
        password: '12345678',
      },
      {
        user_id: '1004',
        password: '12345678',
      },
      {
        user_id: '1005',
        password: '12345678',
      },
      {
        user_id: '1006',
        password: '12345678',
      },
      {
        user_id: '1007',
        password: '12345678',
      },
      {
        user_id: '1008',
        password: '12345678',
      },
      {
        user_id: '1009',
        password: '12345678',
      },
      {
        user_id: '1010',
        password: '12345678',
      },
      {
        user_id: '1011',
        password: '12345678',
      },
      {
        user_id: '1012',
        password: '12345678',
      },
      {
        user_id: '1013',
        password: '12345678',
      },
    ];

    const validUserAccountCount = validUserAccount.filter(
      (f) => f.user_id === values.user_id.trim() && f.password === values.password.trim()
    ).length;

    if (validUserAccountCount > 0) {
      Cookies.set('MJSMS_user_acc', true, {
        path: '/',
        expires: new Date(2147483647 * 1000),
      });

      Swal.fire({
        icon: 'success',
        title: 'Login Successfully',
        html: 'Redirecting to Dashboard..',
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false,
        position: 'center',
      }).then(() => {
        navigate('/dashboard/app', { replace: true });
      });
    } else {
      Swal.fire({
        title: 'Login Failed',
        text: 'Please enter a correct login information!',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="user_id" label="User ID" onChange={handleChange} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
        Login
      </LoadingButton>
    </>
  );
}
