export const ANTENNA_NAMESPACE = 'antenna';
export function ANTENNA_LIST(payload) {
    return {
      type: `${ANTENNA_NAMESPACE}/fetchList`,
      payload,
    };
  }