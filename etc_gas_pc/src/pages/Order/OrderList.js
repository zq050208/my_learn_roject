import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, DatePicker, Select, message, Modal, Table, Popconfirm } from 'antd';
import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import { ORDER_LIST, ORDER_EXPORT, ORDER_DETAIL } from '../../actions/order';
import { ORDER_STATUS } from "@/utils/const";
import router from 'umi/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getCurrentUser } from '@/utils/authority';
import { print } from '@/utils/PrinterHelper';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

// const ReviewRefundModal = Form.create()(function (props) {
//   const { modalProps, onOkCb, currentItem } = props
//   const { getFieldDecorator } = props.form;
//
//   function newOk() {
//   }
//   function confirm() {
//     console.log('退款');
//   }
//
//   return (
//     <Modal width={800} title="审核退款"  {...modalProps} onOk={newOk}>
//       <Table columns={[
//         {
//           title: '订单号',
//           dataIndex: 'uid'
//         },
//         {
//           title: '油站名称',
//           dataIndex: '1'
//         },
//         {
//           title: '联系方式',
//           dataIndex: '1'
//         },
//         {
//           title: '枪号',
//           dataIndex: '1'
//         },
//         {
//           title: '油号',
//           dataIndex: '1'
//         },
//         {
//           title: '升数（升）',
//           dataIndex: '1'
//         },
//         {
//           title: '枪价（元）',
//           dataIndex: '1'
//         },
//         {
//           title: '结算金额',
//           dataIndex: '1'
//         },
//         {
//           title: '订单状态',
//           dataIndex: '1'
//         },
//         {
//           title: '支付时间',
//           dataIndex: '1'
//         },
//       ]} dataSource={[]} bordered />
//       <div>
//         退款原因
//       </div>
//       <div>用户支付了两笔。</div>
//       <Form>
//         <Form.Item label="上传凭证">
//           {
//             getFieldDecorator('cancelReason',
//
//             )(
//               <Input.TextArea></Input.TextArea>
//             )
//           }
//         </Form.Item>
//
//       </Form>
//       <Popconfirm placement="topLeft" title={'确定退款吗'} onConfirm={confirm} okText="Yes" cancelText="No">
//         <Button>退款</Button>
//       </Popconfirm>
//
//     </Modal>
//   );
// });

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class OrderList extends PureComponent {
  state = {
    reviewModalVisible: false,
    hasSearchCon: false,
  }
  componentWillMount() {
    const {groupCode} = getCurrentUser();
    console.log('groupCode', groupCode);
    if (groupCode === 'system' || groupCode === 'company') {
      this.setState({
        hasSearchCon: true
      })
    }
  }

  // ============ 查询 ===============
  @Debounce(500)
  handleSearch = params => {
    console.log(params)
    const startDate = params.startDate ? moment(params.startDate).format(dateFormat) : ''
    const endDate = params.endDate ? moment(params.endDate).format(dateFormat) : ''
    const { dispatch } = this.props;
    dispatch(ORDER_LIST({ ...params, startDate, endDate }));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {
            this.state.hasSearchCon && (
              <Col md={8} sm={24}>
                <FormItem label="用户ID">
                  {getFieldDecorator('userId')(<Input />)}
                </FormItem>
              </Col>
            )
          }
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus')(
                <Select>
                  {
                    ORDER_STATUS.map(item => (
                      <Option key={item.status} value={item.status}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('plateNo')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderSn')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="油品号">
              {getFieldDecorator('oilCode')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="油枪号">
              {getFieldDecorator('oilGun')(<Input />)}
            </FormItem>
          </Col>
          {
            this.state.hasSearchCon && (
              <Col md={8} sm={24}>
                <FormItem label="手机号">
                  {getFieldDecorator('phone')(<Input />)}
                </FormItem>
              </Col>
            )
          }
          <Col md={8} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('startDate')(<DatePicker showTime format={dateFormat} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('endDate')(<DatePicker showTime format={dateFormat} />)}
            </FormItem>
          </Col>
          {
            this.state.hasSearchCon && (
              <Fragment>
                <Col md={8} sm={24}>
                  <FormItem label="加油站商户名">
                    {getFieldDecorator('companyName')(<Input />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="加油站名称">
                    {getFieldDecorator('stationName')(<Input />)}
                  </FormItem>
                </Col>
              </Fragment>
            )
          }

        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col>
            <div style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={onReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  };


  // ============ 处理按钮点击回调事件 ===============
  @Debounce(500)
  handleBtnCallBack = payload => {
    const { dispatch } = this.props;
    const { btn, keys, rows } = payload;
    console.log('-', payload);
    const currentData = rows[0]
    // ============ 导出表格 ===============
    if (btn.code === 'order_export') {
      const { form } = this.tableFunc.props;
      const { current, size } = this.tableFunc.state;
      form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        const startDate = fieldsValue.startDate ? moment(fieldsValue.startDate).format(dateFormat) : ''
        const endDate = fieldsValue.endDate ? moment(fieldsValue.endDate).format(dateFormat) : ''
        dispatch(ORDER_EXPORT({ ...fieldsValue, startDate, endDate, current, size }))

      })
      return;
    }
    console.log('btn', btn, currentData);
    // 申请退款
    if (btn.code === 'order_refund') {
      if (currentData.orderStatusStr !== '支付成功') {
        message.error('请选择支付成功的订单进行退款！')
        return
      }
      dispatch(ORDER_DETAIL(currentData))
      return router.push(`/order/refund/${currentData.orderSn}`)
    }
    // 审核退款
    if (btn.code === 'reviewRefund') {
      if (currentData.orderStatusStr !== '退款中') {
        message.error('请选择退款中的审核退款！')
        return
      }
      return router.push(`/order/review-refund/${currentData.orderSn}`)
    }
    if (btn.code === 'print') {
      console.log('printData', currentData)
      print(currentData);
      message.success('正在打印...');
      return
    }
    return message.warn('未完成该逻辑')
  }

  onRef = (ref) => {
    this.tableFunc = ref
  }

  render() {
    const code = 'order';

    const {
      form,
      loading,
      order: { data },
    } = this.props;

    const columns = [
      {
        title: '用户id',
        dataIndex: 'userId',
      },
      {
        title: '订单号',
        dataIndex: 'orderSn',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '车牌号',
        dataIndex: 'plateNo',
      },
      {
        title: '油枪号',
        dataIndex: 'oilGun',
      },
      {
        title: '油品号',
        dataIndex: 'oilCode',
      },
      {
        title: '加油量（升）',
        dataIndex: 'litre',
      },
      {
        title: '油站挂牌价（元）',
        dataIndex: 'stationUnitPrice',
      },
      {
        title: '应付金额（元）',
        dataIndex: 'originalAmount',
      },
      {
        title: '实付金额（元）',
        dataIndex: 'payAmount',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusStr',
      },
      {
        title: '交易时间',
        dataIndex: 'payTime',
      },
      {
        title: '加油站商户名称',
        dataIndex: 'companyName',
      },
      {
        title: '加油站名称',
        dataIndex: 'stationName',
      },
      {
        title: '优惠总价格（元）',
        dataIndex: 'discounts',
      },
      {
        title: '优惠渠道',
        dataIndex: 'rightName',
      },
      {
        title: '操作员',
        dataIndex: 'createByStr',
      },
    ];

    return (
      <Panel>
        <Grid
          rowKey="orderNo"
          onRef={this.onRef}
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 2000 }}
        />
        {/*<ReviewRefundModal*/}
          {/*onOkCb={() => this.setState({ reviewModalVisible: false })}*/}
          {/*modalProps={{*/}
            {/*visible: this.state.reviewModalVisible,*/}
            {/*onCancel: () => {*/}
              {/*this.setState({*/}
                {/*reviewModalVisible: false*/}
              {/*})*/}
            {/*}*/}
          {/*}}*/}
        {/*></ReviewRefundModal>*/}
      </Panel>
    );
  }
}
export default OrderList;
