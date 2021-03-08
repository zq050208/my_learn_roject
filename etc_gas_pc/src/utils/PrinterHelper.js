import {getLodop} from './LodopFuncs';
function choiceDefaultPrinter() {
  return new Promise((resolve) => {
    if (LODOP.CVERSION) {
      LODOP.On_Return = function (TaskID, Value) {
        if (Value >= 0) {
          resolve(Value)
          window.localStorage.setItem('printerNo', Value)
        } else alert('选择失败！')
      }
      LODOP.SELECT_PRINTER()
      return
    } else {
      const Value = LODOP.SELECT_PRINTER()
      if (Value >= 0) {
        resolve(Value)
        window.localStorage.setItem('printerNo', Value)
      }
    }
  })
}

function renderPrintTemplate(data) {
  let {
    stationName,
    orderSn,
    payTime,
    oilGun,
    oilNo,
    stationUnitPrice,
    litre,
    originalAmount,
    payAmount,
    plateNo,
    phone,
    oilCode,
    createTime,
  } = data

  oilNo = oilNo? (oilNo+'#'):oilCode;

  return /* HTML */`
    <table style="margin:0px;font-size:11pt;width:100%" id="table">
      <tr>
        <td colspan="2" style="text-align: center;">${stationName}</td>
      </tr>
      <tr>
        <td style="width: 50%;">单号:${orderSn}</td>
      </tr>
      <tr>
        <td>支付时间:${payTime || createTime}</td>
      </tr>
      <tr>
        <td style="font-size: 200%;font-weight: bold;">枪号:${oilGun}</td>
      </tr>
      <tr>
        <td>油品:${oilNo}</td>
      </tr>
      <tr>
        <td>单价:${stationUnitPrice}</td>
      </tr>
      <tr>
        <td>升数:${litre}</td>
      </tr>
      <tr>
        <td colspan="2" style="font-size: 140%;font-weight: bold;">应付金额:${originalAmount}</td>
      </tr>
      <tr>
        <td>
          实收金额:${payAmount}
        </td>
      </tr>
      <tr>
        <td>车牌:${plateNo}</td>
      </tr>
      <tr>
        <td>电话:${phone}
      </tr>
      <tr>
        <td>来源:ETC加油</td>
      </tr>
      <tr>
        <td style="margin-top: 10px;">高灯ETC加油—生活因简单而美好</td>
      </tr>
    </table>
  `
}

export async function print(data) {
  LODOP = getLodop()
  // LODOP.SET_PRINT_STYLE('FontName', '微软雅黑')

  const printerCount = LODOP.GET_PRINTER_COUNT()
  let printerNo = window.localStorage.getItem('printerNo')
  printerNo = printerNo ? +printerNo : void 0
  console.log('printerNo: ', printerNo)

  if (printerCount > 1 && printerNo == void 0) {
    printerNo = await choiceDefaultPrinter()
    LODOP.SET_PRINTER_INDEX(printerNo)
  }

  LODOP.PRINT_INIT('')
  if (printerCount > 1) {
    if (!LODOP.SET_PRINTER_INDEX(printerNo)) {
      console.error('设置默认打印机失败')
      return
    }
  }
  LODOP.ADD_PRINT_TABLE(
    0,
    0,
    '100%',
    '100%',
    `<body style='margin:0;'>${renderPrintTemplate(
      data
    )}</body>`
  )
  LODOP.PRINT()
}
