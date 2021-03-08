import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';
import downloadData from '@/utils/download';

export async function list(params) {
  return request(`/api/order/order_list`, {
    method: 'POST',
    body: params
  });
}

export async function returnMoneyApi( params) {
  return request(`/api/order/return_money`, {
    method: 'POST',
    body: params,
  });
}

export async function refunDetailApi(params) {
  return request(`/api/order/get_refund_info`, {
    method: 'POST',
    body: params
  })
}
// 订单详情
export async function OrderInfoApi(params) {
  return request(`/api/order/orderInfo`, {
    method: 'POST',
    body: params
  })
}


export async function remove(params) {
  return request('/api/blade-system/client/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function exportTable(params) {
  return downloadData('/api/order/export_order_list', {
    method: 'GET',
    body: params,
  });
}
// 审核退款
export async function orderrefundApi(params) {
  return request('/api/order/refund', {
    method: 'POST',
    body: params,
  });
}


