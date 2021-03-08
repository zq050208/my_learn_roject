import { message } from 'antd';
import router from 'umi/router';
import { OIL_STATION_NAMESPACE } from '../actions/oilstation';
import {  getOilStationList } from '../services/oilstation';
export default {
    namespace: OIL_STATION_NAMESPACE,
    state: {
        data: {
            list: [],
            pagination: false,
        },
    },
    effects: {
			*fetchList({ payload }, { call, put }) {
				const response = yield call(getOilStationList, payload);
				// const data = [{gasStationId:'63'}]
				if (+response.code === 0) {
					console.log("response",response.data[0].records)
					yield put({
						type: 'saveList',
						payload: {
							list: response.data[0].records,
							pagination: {
								total: response.data[0].total,
								current: response.data[0].current,
								pageSize: response.data[0].size,
							}, 
						},
					});
				}
			},
    },
    reducers: {
			saveList(state, action) {
				console.log("----------------",action)
				return {
					...state,
					data: action.payload,
				};
			},
    }
}