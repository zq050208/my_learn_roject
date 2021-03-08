import { delay } from 'roadhog-api-doc';

function getFakeList(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const data = [];
  data.push({
    id: '1',
    deptName: '美德森有限公司',
    tenantId: '000000',
    fullName: '江苏刀锋科技有限公司',
    sort: '1',
    tt: '1',
    systemBus: 'hhh',
    type: '公司',
    status: '在线',
    children: [
      {
        id: '2',
        deptName: '常州刀锋',
        tenantId: '000000',
        fullName: '常州刀锋科技有限公司',
        sort: '1',
        tt: '1',
        systemBus: 'hhh',
        type: '油站',
        status: '在线',
        city: '广东省广州市',
        account: '242342343243',
        longitude: '33.45',
        latitude: '22.34',
        address: '广东省广州市ssss',
        phone: '23423432434',
        gunNo: '2,3,4',
        oilNo: '2,3,4',
      },
      {
        id: '3',
        deptName: '南京刀锋',
        tenantId: '000000',
        fullName: '南京刀锋科技有限公司',
        sort: '2',
        tt: '1',
        systemBus: 'hhh',
        type: '油站',
        status: '在线',
        city: '广东省广州市',
        account: '242342343243',
        longitude: '33.45',
        latitude: '22.34',
        address: '广东省广州市ssss',
        phone: '23423432434',
        gunNo: '2,3,4',
        oilNo: '2,3,4',
      },
    ],
  });
  json.data = data;
  return res.json(json);
}

function getFakeDetail(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const detail = {
    id: '3',
    deptName: '南京刀锋',
    tenantId: '000000',
    fullName: '南京刀锋科技有限公司',
    sort: '2',
    tt: '1',
    systemBus: 'hhh',
    type: '油站',
    status: '在线',
    city: '广东省广州市',
    account: '242342343243',
    longitude: '33.45',
    latitude: '22.34',
    address: '广东省广州市ssss',
    phone: '23423432434',
    gunNo: '2,3,4',
    oilNo: '2,3,4',
  };
  json.data = detail;
  return res.json(json);
}

function getFakeTree(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const list = [];
  list.push({
    title: '江苏刀锋',
    value: '1',
    key: '1',
    children: [
      {
        title: '常州刀锋',
        value: '2',
        key: '2',
      },
      {
        title: '南京刀锋',
        value: '3',
        key: '3',
      },
    ],
  });
  json.data = list;
  return res.json(json);
}

function fakeSuccess(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  return res.json(json);
}

const proxy = {
  'POST /api/blade-system/dept/list': getFakeList,
  'GET /api/blade-system/dept/detail': getFakeDetail,
  'GET /api/blade-system/dept/tree': getFakeTree,
  'POST /api/blade-system/dept/submit': fakeSuccess,
  'POST /api/blade-system/dept/remove': fakeSuccess,
};

export default delay(proxy, 500);
