import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { accountLogin } from '../services/user';
import { dynamicRoutes, dynamicButtons, dynamicGroups } from '../services/menu';
import {
  setAuthority,
  setToken,
  setCurrentUser,
  setRoutes,
  setButtons,
  removeAll,
  setGroups
} from '../utils/authority';
import { getPageQuery, formatRoutes, formatButtons } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.success) {
        const { success, data } = response;
        console.log('gggg', data)
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: success,
            type: 'login',
            data: { ...data },
          },
        });
        const responseRoutes = yield call(dynamicRoutes);
        const responseButtons = yield call(dynamicButtons);
        // 获取当前账号的分组信息
        let getGroupPar
        if (data.groupCode !== 'system') {
          getGroupPar = {groupCode: data.groupCode}
        }
        const responseGroups = yield call(dynamicGroups, getGroupPar);
        console.log("menuData:",responseGroups.data)
        yield put({
          type: 'saveMenuData',
          payload: {
            routes: responseRoutes.data,
            buttons: responseButtons.data,
            groups: responseGroups.data
          },
        });
        reloadAuthorized();
        console.log('window.location.href', window.location.href)
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace('/welcome'));
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      clearInterval(window.timer);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          type: 'logout',
          data: {
            authority: 'guest',
            logout: true,
          },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { status, type } = payload;

      if (status) {
        const {
          data: { tokenType, accessToken, authority, account, userName, avatar, stationIds, groupCode, companyName, stationName },
        } = payload;
        const token = `${tokenType} ${accessToken}`;
        setToken(token);
        setAuthority(authority);
        setCurrentUser({ avatar, account, name: userName, authority, stationIds, groupCode, companyName, stationName });
      } else {
        removeAll();
      }

      return {
        ...state,
        status: type === 'login' ? (status ? 'ok' : 'error') : '',
        type: payload.type,
      };
    },
    saveMenuData(state, { payload }) {
      const { routes, buttons, groups } = payload;
      setRoutes(formatRoutes(routes));
      console.log("login-buttons",formatButtons(buttons) )
      setButtons(formatButtons(buttons));
      setGroups(groups)
      return {
        ...state,
      };
    },
  },
};
