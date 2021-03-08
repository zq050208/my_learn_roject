import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Button, Col, Form, Input, Row, DatePicker, message, Divider, Modal} from 'antd';
import Panel from '../../components/Panel';
import { CLASSES_LIST } from '../../actions/classes';
import { getShiftTime, handOver, shiftslistApi, historyClasses } from '../../services/classes';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import {orderrefundApi} from "../../services/order";

const FormItem = Form.Item;
const Dateformat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ classes, loading }) => ({
  classes,
  loading: loading.models.order,
}))
@Form.create()
class ClassesList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shiftTime: '',
      endTime: ''
    }
  }

  async componentDidMount() {
    const res = await getShiftTime()
    this.setState({
      endTime: res.data.endTime
    })
  }

  // ============ 查询 ===============
  handleSearch = (params = {}) => {
    // historyClasses(params).then(res => {
    //   console.log('res========', res);
    //   this.setState({
    //     list: res.data.records
    //   })
    // })
    const { dispatch } = this.props;
    dispatch(CLASSES_LIST({ ...params }));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { shiftTime, endTime } = this.state;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {/*<Col md={9} sm={24}>*/}
        {/*<FormItem label="接班时间">*/}
        {/*{getFieldDecorator('startDate', {*/}
        {/*initialValue: shiftTime && moment(shiftTime, Dateformat)*/}
        {/*})(<DatePicker disabled format={Dateformat} showTime />)}*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        <Col md={24} sm={24}>
          <FormItem label="交班时间"> {endTime}
            {/* {getFieldDecorator('endDate', {
              initialValue: moment(, Dateformat)
            })(<DatePicker disabled format={Dateformat} showTime />)} */}
          </FormItem>
        </Col>
        {/* <Col md={9} sm={24}>
          <FormItem label="接班时间">
            {getFieldDecorator('startUpTime', {})(<DatePicker format={Dateformat} showTime />)}
          </FormItem>
        </Col>
        <Col md={1} sm={24}>
          <FormItem >
            -
          </FormItem>
        </Col>
        <Col md={9} sm={24}>
          <FormItem>
            {getFieldDecorator('endUpTime', {})(<DatePicker format={Dateformat} showTime />)}
          </FormItem>
        </Col>
        <Col md={9} sm={24}>
          <FormItem label="交班时间">
            {getFieldDecorator('startDownTime', {})(<DatePicker format={Dateformat} showTime />)}
          </FormItem>
        </Col>
        <Col md={1} sm={24}>
          <FormItem >
            -
          </FormItem>
        </Col>
        <Col md={9} sm={24}>
          <FormItem>
            {getFieldDecorator('endDownTime', {})(<DatePicker format={Dateformat} showTime />)}
          </FormItem>
        </Col> */}
        {/*<Col md={6} sm={24}>*/}
        {/*<FormItem label="收银员">*/}
        {/*{getFieldDecorator('cashier', {*/}
        {/*})(<Input />)}*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*<Col>*/}
        {/*  <div style={{ float: 'right' }}>*/}
        {/*    <Button type="primary" htmlType="submit">*/}
        {/*      查询*/}
        {/*    </Button>*/}
        {/*    <Button style={{ marginLeft: 8 }} onClick={onReset}>*/}
        {/*      重置*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</Col>*/}
      </Row>
    );
  };

  @Debounce(500)
  handleBtnCallBack = async payload => {
    const { btn, keys } = payload;
    if (btn.code === 'classes_export') {
      const { form } = this.tableFunc.props;
      const { current, size } = this.tableFunc.state;
      form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        // if(!fieldsValue.cashier || !this.checkContent(fieldsValue.cashier)) {
        //   return message.error('请输入收银员！')
        // }
        // const startDate = fieldsValue.startDate ? moment(fieldsValue.startDate).format(Dateformat) : ''
        // const endDate = moment(new Date()).format(Dateformat)
        // const {stationIds} = JSON.parse(localStorage.getItem('sword-current-user'))
        // ...fieldsValue, cashier: fieldsValue.cashier.trim(), startDate, endDate, stationId: stationIds[0]
        if (!this.state.endTime) { return message.error('没有交班时间') }
        let _that = this
        Modal.confirm({
          title: '确认提交',
          content: '是否确认交班?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            const { msg } = await handOver({ startTime: _that.state.endTime, })
            message.success(msg)
            window.location.reload()
            return
          },
          onCancel() {},
        });
        // this.setState({
        //   list: {
        //     list: [data]
        //   }
        // })
      })
    }
    if (btn.code === 'classes_history') {
      router.push('/classes/list/historyClasses')
    }
  }

  checkContent = (value) => {
    return Boolean(value.trim())
  }

  onRef = (ref) => {
    this.tableFunc = ref
  }

  render() {
    const code = 'classes';

    const {
      form,
      loading,
      classes: { data },
    } = this.props;

    const columns = [
      {
        title: '接班时间',
        dataIndex: 'startTime',
        width: 100,
      },
      {
        title: '交班时间',
        dataIndex: 'endTime',
        width: 100,
      },
      {
        title: '油品',
        dataIndex: 'oilCode',
        width: 100,
      },
      {
        title: '应付金额（元）',
        dataIndex: 'totalOrgPrice',
        width: 100,
      },
      {
        title: '实付总金额（元）',
        dataIndex: 'totalActualPayPrice',
        width: 100,
      },
      {
        title: '加油笔数',
        dataIndex: 'totalCount',
        width: 100,
      },
      {
        title: '加油总升数（升）',
        dataIndex: 'totalCapacity',
        width: 100,
      },
      {
        title: '退款总金额（元）',
        dataIndex: 'totalReturnPrice',
        width: 100,
      },
      {
        title: '退款笔数（笔）',
        dataIndex: 'totalReturnCount',
        width: 100,
      },
      {
        title: '退款总升数（升）',
        dataIndex: 'totalReturnCapacity',
        width: 100
      },
    ];

    return (
      <Panel>
        <Grid
          onRef={this.onRef}
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={false}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          scroll={{ x: 1000 }}
          columns={columns}
          tblProps={{ rowSelection: false }}
        />
      </Panel>
    );
  }
}
export default ClassesList;
