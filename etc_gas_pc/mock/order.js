import { delay } from 'roadhog-api-doc';

function getFakeList(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const list = [];
  list.push(
    {
      id: '1',
      orderNo: '1234243243433',
      telNumber: '135****4567',
      oilGun: '11',
      oilName: '92#',
      num: '15',
      orgPrice: '300',
      actualPayPrice: '300',
      orderStatus: '已支付',
      reply_refund: '2020-02-03 11:12:30',
      status: '已支付'
    },
    {
      id: '2',
      orderNo: '1234243243433',
      telNumber: '135****4567',
      oilGun: '11',
      oilName: '92#',
      num: '15',
      orgPrice: '300',
      actualPayPrice: '300',
      orderStatus: '已支付',
      reply_refund: '2020-02-03 11:12:30',
      status: '已支付'
    },
  );
  json.data = {
    total: 10,
    size: 10,
    current: 2,
    searchCount: true,
    pages: 1,
    data: list,
  };
  return res.json(json);
}

function getFakeDetail(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  json.data = {
    id: '1',
    orderId: '1234243243433',
    phone: '135****4567',
    gunNo: '11',
    oilNo: '92#',
    litre: '15',
    price: '300',
    totalPrice: '300',
    status: '已支付',
    payTime: '2020-02-03 11:12:30',
    payStatus: '已支付'
  };
  return res.json(json);
}

function fakeSuccess(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  return res.json(json);
}

const proxy = {
  'POST /api/orderManager/orderList': getFakeList,
  'GET /api/blade-system/order/detail': getFakeDetail,
  'POST /api/blade-system/order/submit': fakeSuccess,
  'POST /api/blade-system/client/remove': fakeSuccess,
};
export default delay(proxy, 500);
