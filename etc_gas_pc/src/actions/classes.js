export const CLASSES_NAMESPACE = 'classes';

export function CLASSES_LIST(payload) {
  return {
    type: `${CLASSES_NAMESPACE}/fetchList`,
    payload,
  };
}

export function CLASSES_HISTORY_LIST(payload) {
  return {
    type: `${CLASSES_NAMESPACE}/fetchHistoryClasses`,
    payload,
  };
}
