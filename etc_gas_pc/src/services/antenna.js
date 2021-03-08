import request from '../utils/request';
export async function getAntennaList(params) {
	return request('/platformManage/antennaManage/queryPageList', {
			method: 'POST',
			body: params,
	});
}