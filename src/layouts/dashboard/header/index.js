import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
// utils
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import Logo from '../../../components/logo/Logo';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 64;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100%)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('MJSMS_user_acc');
    Cookies.remove('MJSMS_chart_view');

    Swal.fire({
      icon: 'success',
      title: 'Logout Successfully',
      html: '',
      timer: 1500,
      showCancelButton: false,
      showConfirmButton: false,
      position: 'center',
    }).then(() => {
      navigate('/dashboard/app', { replace: true });
    });
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <Logo />
        <Typography variant="h4" sx={{ color: '#061B64', mx: 2 }}>
          MJ Sales Monitoring System
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="primary">
          <Iconify sx={{ color: '#061B64' }} icon="material-symbols:exit-to-app" width={30} onClick={handleLogout} />
        </IconButton>
      </StyledToolbar>
    </StyledRoot>
  );
}
