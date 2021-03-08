import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';
import downloadData from '@/utils/download';

// =====================历史班次===========================
export async function shiftslistApi(params) {
  return request('/api/change_shifts/change_shift', {
    method: 'POST',
    body: params,
  });
}

export async function getShiftTime(params) {
  return request(`/api/change_shifts/get_change_shifts_time`, {method: 'POST'})
}

// 交接班
export async function handOver(params) {
  return request('/api/change_shifts/change_shift', {
    method: 'POST',
    body: params,
  });
}
// /api/change_shifts/change_shift
// 导出历史表格
export async function exportClassesTable(params) {
  return downloadData('/api/change_shifts/export_excel', {
    method: 'GET',
    data: params,
  });
}

// 历史班次查询
export async function historyClasses(params) {
  return request('/api/change_shifts/show_list', {
    method: 'POST',
    body: params,
  });
}
export async function currentClassesApi(params) {
  return request('/api/change_shifts/show_current_data', {
    method: 'POST',
    body: params,
  });
}
// 详情
export async function currentClassesdetailApi(params) {
  return request('/api/change_shifts/detail', {
    method: 'POST',
    body: params,
  });
}
