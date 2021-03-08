import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================部门===========================
export async function list(params) {
  return request(`/api/gas_station/show_station_list`, {
    method: 'POST',
    body: params
  });
}

export async function tree(params) {
  return request(`/api/station_company/show_company_list`, {
    method: 'POST',
    body: func.toFormData(params)
  });
}

export async function remove(params) {
  return request('/api/blade-system/dept/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/gas_station/add_station', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/api/gas_station/update_station', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/gas_station/station_detail`, {
    method: 'POST',
    body: params
  });
}

export async function online(params) {
  return request('/api/gas_station/turn_status', {
    method: 'POST',
    body: params,
  });
}
// 
export async function get_oil_priceApi(params) {
  return request(`/api/gas_station/get_oil_price?${stringify(params)}`);
}
// 添加油价
export async function add_oil_priceApi(params) {
  return request(`/api/gas_station/add_oil_price`, {
    method: 'POST',
    body: params
  });
}

export async function setOilPriceStatus(params) {
  return request(`/api/gas_station/set_oil_price_status`, {
    method: 'POST',
    body: params
  });
}
