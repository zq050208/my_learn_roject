import { clientId, clientSecret } from '@/defaultSettings';
import { getToken } from '@/utils/authority';
import queryString from 'query-string';
import { message } from 'antd';
import { Base64 } from 'js-base64';
interface downloadDataType {
  data?: null | object;
  method?: string
}
// fetch下载文件
const downloadData = async (url : string, { data, method = 'GET' } : downloadDataType) => {
  try {

    let defaultParams = {}
    if (data) {
      if (method === 'POST') {
        defaultParams = {body: JSON.stringify(data)}
      } else {
        // 拼接参数
        url = url.endsWith('?')
          ? url + queryString.stringify(data)
          : `${url}?${queryString.stringify(data)}`;
      }
    }
    let reqParams = { credentials: 'include', method,  ...defaultParams,  headers: { 'content-type': 'application/json', Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`, } }
    const token = getToken();
    if (token) {
      reqParams.headers['Blade-Auth'] = token
    }
    const res = await fetch(url, reqParams);
    // let fRes = await res.clone().json()
    // // 内部帮接口报错处理了
    // if (fRes && fRes.code) {
    //   throw fRes
    // }

    const blob = await res.blob();
    let disposition = res.headers.get('Content-Disposition')
    let downloadFileNameMsg = [Date.now(), 'xls']
    try {
      downloadFileNameMsg = disposition ?  disposition.split('fileName=')[1].split('.') : [Date.now(), 'xls']
    } catch (e) {
      downloadFileNameMsg = [Date.now(), 'xls']
    }
    const filename = `${decodeURI(downloadFileNameMsg[0])}.${downloadFileNameMsg[1]}`;
    // 兼容旧版本
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      // 兼容火狐，将a标签添加到body当中
      document.body.appendChild(a);
      // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      const downloadUrl = window.URL.createObjectURL(blob);
      a.href = downloadUrl;
      a.download = filename;
      a.target = '_blank';
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }
  } catch (err) {
    message.error(err.msg);
    throw err;
  }
};

export default downloadData
