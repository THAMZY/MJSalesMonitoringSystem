/* eslint-disable camelcase */
import axios from 'axios';

export const getMaintenanceDate = () =>
  fetch(`${process.env.REACT_APP_API}Maintenance/getMaintenanceDate`, { credentials: 'include' }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });
