import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

Loader.propTypes = {
  spinner: PropTypes.bool,
};

export default function Loader({ spinner }) {
  return (
    <div>
      <Backdrop open={spinner} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
