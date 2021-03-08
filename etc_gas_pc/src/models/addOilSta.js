import { message } from 'antd';
import router from 'umi/router';
import { ADD_OIL_STA_NAMESPACE } from '../actions/addOilSta';
import { getGasDetail, addGasMachine, editGasMachine } from '../services/addOilSta';
export default {
    namespace: ADD_OIL_STA_NAMESPACE,
    state: {
			data: {
				list: [],
				pagination: false,
			},
			detail: {},
    },
    effects: {
			*fetchList({ payload }, { call, put }) {
				const response = yield call(getGasDetail, payload);
				if (+response.code === 0) {
					yield put({
						type: 'saveDetail',
						payload: {
							detail: response.data[0],
						},
					});
					yield put({
						type: 'saveList',
						payload: {
							list: response.data[0].fillingMachineManageVOList,
							pagination: false,
						},
					})
				}
			},
			*addGasMachine({ payload }, { call }) {
				const response = yield call(addGasMachine, payload);
				if (+response.code === 0) {
					message.success('添加成功');
				}
			},
			*editGasMachine({ payload }, { call }) {
				const response = yield call(editGasMachine, payload);
				if (+response.code === 0) {
					message.success('修改成功');
				}
			}
    },
    reducers: {
			saveDetail(state, action) {
				return {
					...state,
					detail: action.payload.detail,
				};
			},
			saveList(state, action) {
				return {
					...state,
					data: action.payload,
				};
			},
    }
}