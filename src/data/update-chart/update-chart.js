/* eslint-disable camelcase */
import axios from 'axios';

export const viewCompanyChartDetails = (company_id) =>
  fetch(`${process.env.REACT_APP_API}UpdateChart/viewCompanyChartDetails?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const updateCompanyChartDetails = (update) =>
  fetch(`${process.env.REACT_APP_API}UpdateChart/updateCompanyChartDetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(update),
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });
