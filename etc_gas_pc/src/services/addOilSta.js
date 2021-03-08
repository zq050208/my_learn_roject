import request from '../utils/request';
export async function getGasDetail(params) {
	return request('/platformManage/stationManage/detail', {
			method: 'POST',
			body: params,
	});
}
export async function addGasMachine(params) {
	return request('/platformManage/fillingMachineManage/add', {
			method: 'POST',
			body: params,
	});
}
export async function editGasMachine(params) {
	return request('/platformManage/fillingMachineManage/update', {
			method: 'POST',
			body: params,
	});
}