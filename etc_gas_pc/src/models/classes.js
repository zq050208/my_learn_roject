import { message } from 'antd';
import router from 'umi/router';
import { CLASSES_NAMESPACE } from '../actions/classes';
import {  shiftslistApi, historyClasses, currentClassesApi } from '../services/classes';

export default {
  namespace: CLASSES_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: false,
    },
    detail: {},
    historyClasses: []
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(currentClassesApi, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
            pagination: false,
          },
        });
      }
    },
    *fetchHistoryClasses({ payload }, { call, put }) {
      const response = yield call(historyClasses, payload);
      if (response.success) {
        yield put({
          type: 'saveHistoryClasses',
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
    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
    },
    *refund({ payload }, { call }) {
      const response = yield call(refund, payload);
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
    saveHistoryClasses(state, action) {
      return {
        ...state,
        historyClasses: action.payload,
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
