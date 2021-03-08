import { message } from 'antd';
import router from 'umi/router';
import { ORDER_NAMESPACE } from '../actions/order';
import { list, returnMoneyApi, remove, exportTable } from '../services/order';

export default {
  namespace: ORDER_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: false,
    },
    detail: {},
  },
  effects: {
    *export({ payload }, { call }) {
      yield call(exportTable, payload);
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
            pagination: {
              total: response.data.total,
              current: response.data.current,
              pageSize: response.data.size,
            },
          },
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: {
          detail: payload,
        },
      });
    },
    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
    },
    *refund({ payload }, { call }) {
      console.log(payload, '---------')
      const response = yield call(returnMoneyApi, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/order/list');
      }
    },
    *remove({ payload }, { call }) {
      const {
        data: { keys },
        success,
      } = payload;
      const response = yield call(remove, { ids: keys });
      if (response.success) {
        success();
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
    removeDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
