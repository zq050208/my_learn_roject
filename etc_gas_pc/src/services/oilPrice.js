import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';
import downloadData from '@/utils/download';

// =====================油价管理===========================

export async function list(params) {
  return request(`/api/oilManager/list`, {
    method: 'POST',
    body: params,
  });
}

export async function tree(params) {
  return request(`/api/blade-system/dept/tree?${stringify(params)}`);
}

export async function remove(params) {
  return request(`/api/oilManager/hisOilPriceDelete?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/oilManager/addPrice', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/api/oilManager/hisOilPriceUpdate', {
    method: 'POST',
    body: params,
  });
}

export async function stationDetail(params) {
  return request(`/api/oilManager/oneOilPrice?${stringify(params)}`);
}

export async function detail(params) {
  return request(`/api/blade-system/dept/detail?${stringify(params)}`);
}

export async function history(params) {
  return request('/api/oilManager/hisList', {
    method: 'POST',
    body: params,
  });
}

export async function exportTable(params) {
  return downloadData('/api/oilManager/exportHisList', {
    method: 'POST',
    data: params,
  });
}

export async function getNewOilPrice(params) {
  return request(`/api/gas_station/get_oil_price?${stringify(params)}`);
}

