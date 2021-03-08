export const OIL_STATION_NAMESPACE = 'oilstation';
export function OIL_STATION_LIST(payload) {
    return {
      type: `${OIL_STATION_NAMESPACE}/fetchList`,
      payload,
    };
  }