// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

SalesWidgetSummary.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function SalesWidgetSummary({ title, total, icon, type, color = 'primary', sx, ...other }) {
  return (
    <Card
      sx={{
        py: 2,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        ...sx,
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={30} height={30} />
      </StyledIcon>

      <Typography variant="h4">
        {type === 'number' && total === 0
          ? total
          : type === 'number' && total !== 0
          ? fShortenNumber(total)
          : type === 'percentage'
          ? `${total} %`
          : total}
      </Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}
