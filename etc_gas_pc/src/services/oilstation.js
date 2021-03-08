import request from '../utils/request';
export async function getOilStationList(params) {
	return request('/platformManage/stationManage/queryPageList', {
			method: 'POST',
			body: params,
	});
}