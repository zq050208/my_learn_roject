export const ORDER_NAMESPACE = 'order';

export function ORDER_LIST(payload) {
  return {
    type: `${ORDER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function ORDER_DETAIL(payload) {
  return {
    type: `${ORDER_NAMESPACE}/fetchDetail`,
    payload,
  };
}

export function ORDER_EXPORT(payload) {
  return {
    type: `${ORDER_NAMESPACE}/export`,
    payload,
  };
}

export function ORDER_REFUND(payload) {
  return {
    type: `${ORDER_NAMESPACE}/refund`,
    payload,
  };
}

export function CLIENT_REMOVE(payload) {
  return {
    type: `${ORDER_NAMESPACE}/remove`,
    payload,
  };
}
