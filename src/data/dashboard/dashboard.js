/* eslint-disable camelcase */
import axios from 'axios';

export const getCompanyName = () =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getCompanyName`, { credentials: 'include' }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSalesRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSalesRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getTargetRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getTargetRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSalesDate = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSalesDate?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSummaryTotalSalesRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTotalSalesRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSummaryTotalTargetRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTotalTargetRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSummaryTargetAchieved = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTargetAchieved?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getSummaryLatestSalesGrowth = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryLatestSalesGrowth?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });

export const getAllCompanyChartData = () =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getAllCompanyChartData`, {
    credentials: 'include',
  }).then((data) => {
    if (data.status === 503) {
      throw Number(data.status);
    }
    return data.json();
  });
