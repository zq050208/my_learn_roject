import { delay } from 'roadhog-api-doc';

function getFakeList(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const data = [];
  data.push(
    {
      id: '1',
      deptName: '美德森',
      tenantId: '000000',
      oilName: '南平加油站',
      children: [
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
      ]

    },
    {
      id: '2',
      deptName: '美德森',
      tenantId: '000000',
      oilName: '南平加油站',
      oilNo: '92#',
      countryPrice: '5.2',
      stationPrice: '5.2',
      discountPrice: '4.8',
      gunNo: '1,2,3',
      sort: '1',
      children: [
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
      ]
    },
    {
      id: '3',
      deptName: '美德森',
      tenantId: '000000',
      oilName: '南平加油站',
      oilNo: '92#',
      countryPrice: '5.2',
      stationPrice: '5.2',
      discountPrice: '4.8',
      gunNo: '1,2,3',
      sort: '1',
      children: [
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
      ]
    },
    {
      id: '4',
      deptName: '美德森',
      tenantId: '000000',
      oilName: '南平加油站',
      oilNo: '92#',
      countryPrice: '5.2',
      stationPrice: '5.2',
      discountPrice: '4.8',
      gunNo: '1,2,3',
      sort: '1',
      children: [
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
        {
          oilNo: '92#',
          countryPrice: '5.2',
          stationPrice: '5.2',
          discountPrice: '4.8',
          gunNo: '1,2,3',
          sort: '1',
        },
      ]
    }
  );
  json.data = data;
  return res.json(json);
}

function getFakeDetail(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const detail = {
    id: 2,
    parentId: 1,
    parentName: '江苏刀锋',
    tenantId: '000000',
    deptName: '常州刀锋',
    fullName: '常州刀锋科技有限公司',
    sort: 1,
    nextSort: 4,
    remark: '测试备注',
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
  'GET /api/oil-price/list': getFakeList,
};

export default delay(proxy, 500);
