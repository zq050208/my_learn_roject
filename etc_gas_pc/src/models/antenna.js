import { message } from 'antd';
import router from 'umi/router';
import { ANTENNA_NAMESPACE } from '../actions/antenna';
import { getAntennaList } from '../services/antenna';
export default {
    namespace: ANTENNA_NAMESPACE,
    state: {
        data: {
            list: [],
            pagination: false,
        },
    },
    effects: {
			*fetchList({ payload }, { call, put }) {
				const response = yield call(getAntennaList, payload);
				if (+response.code === 0) {
					yield put({
						type: 'saveList',
						payload: {
							list: response.data[0].records,
							pagination: {
								total: response.data[0].total,
								current: response.data[0].current,
								pageSize: response.data[0].size,
							}
						},
					});
				}
			},
    },
    reducers: {
			saveList(state, action) {
				return {
					...state,
					data: action.payload,
				};
			},
    }
}