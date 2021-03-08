import { ORDER_NAMESPACE } from '@/actions/order';

export const OIL_PRICE_NAMESPACE = 'oilPrice';

export function STATION_LIST(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function STATION_DETAIL(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/fetchDetail`,
    payload,
  };
}

export function HISTORY_LIST(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/fetchHistoryList`,
    payload,
  };
}

export function OIL_PRICE_SUBMIT(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/submit`,
    payload,
  };
}

export function OIL_PRICE_UPDATE(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/update`,
    payload,
  };
}

export function OILPRICE_HISTORY_EXPORT(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/export`,
    payload,
  };
}

export function HISTORY_REMOVE(payload) {
  return {
    type: `${OIL_PRICE_NAMESPACE}/remove`,
    payload,
  }
}
