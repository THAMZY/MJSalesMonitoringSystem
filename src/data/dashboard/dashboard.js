/* eslint-disable camelcase */
import axios from 'axios';

export const getCompanyName = () =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getCompanyName`, { credentials: 'include' }).then((data) => data.json());

export const getSalesRevenue3MonthBefore = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSalesRevenue3MonthBefore?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getTargetRevenue3MonthBefore = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getTargetRevenue3MonthBefore?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getSalesDate3MonthBefore = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSalesDate3MonthBefore?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getSummaryTotalSalesRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTotalSalesRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getSummaryTotalTargetRevenue = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTotalTargetRevenue?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getSummaryTargetAchieved = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryTargetAchieved?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());

export const getSummaryLatestSalesGrowth = (company_id) =>
  fetch(`${process.env.REACT_APP_API}Dashboard/getSummaryLatestSalesGrowth?company_id=${company_id}`, {
    credentials: 'include',
  }).then((data) => data.json());
