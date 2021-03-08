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

const proxy = {
  'POST /api/blade-system/classes/list': getFakeList,
};
export default delay(proxy, 500);
