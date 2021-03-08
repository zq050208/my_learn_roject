export const ADD_OIL_STA_NAMESPACE = 'addOilSta';
export function ADD_OIL_DETAIL(payload) {
  return {
    type: `${ADD_OIL_STA_NAMESPACE}/fetchList`,
    payload,
  };
}
export function ADD_GAS_MACHINE(payload) {
  return {
    type: `${ADD_OIL_STA_NAMESPACE}/addGasMachine`,
    payload,
  };
}