import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/station_company/show_company_list`, {
    method: 'POST',
    body: params,
  });
}

export async function select(params) {
  return request(`/api/station_node/tree?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/station_company/add_company', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/station_company/company_detail`, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request('/api/blade-system/tenant/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function update(params) {
  return request('/api/station_company/update_company', {
    method: 'POST',
    body: params,
  });
}
