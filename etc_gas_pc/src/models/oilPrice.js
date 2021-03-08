import { message } from 'antd';
import router from 'umi/router';
import { OIL_PRICE_NAMESPACE } from '../actions/oilPrice';
import { list, submit, detail, remove, tree, history, exportTable, update, stationDetail } from '../services/oilPrice';

export default {
  namespace: OIL_PRICE_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: false,
    },
    history: {
      list: [],
      pagination: false,
    },
    init: {
      tree: [],
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
            list: response.data,
            pagination: false,
          },
        });
      }
    },
    *fetchHistoryList({ payload }, { call, put }) {
      const response = yield call(history, payload);
      if (response.success) {
        yield put({
          type: 'saveHistoryList',
          payload: {
            list: response.data.data,
            pagination: false,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const response = yield call(tree, payload);
      if (response.success) {
        yield put({
          type: 'saveInit',
          payload: {
            tree: response.data,
          },
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(stationDetail, payload);
      if (response.success) {
        yield put({
          type: 'saveDetail',
          payload: {
            detail: response.data,
          },
        });
      }
    },
    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
    },
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/system/oilPrice');
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/system/oilPrice');
      }
    },
    *remove({ payload }, { call }) {
      const {
        data,
        success,
      } = payload;
      const response = yield call(remove, {...data});
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
    saveHistoryList(state, action) {
      return {
        ...state,
        history: action.payload,
      };
    },
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
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
