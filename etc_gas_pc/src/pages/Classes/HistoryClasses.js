import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, DatePicker, message, Divider } from 'antd';
import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import {Link} from 'umi'
import { CLASSES_HISTORY_LIST } from '@/actions/classes';
import { exportClassesTable } from '@/services/classes';

const FormItem = Form.Item;
const Dateformat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ classes, loading }) => ({
  classes,
  loading: loading.models.order,
}))
@Form.create()
class HistoryClasses extends PureComponent {
  constructor(props) {
    super(props);
  }

  // async componentDidMount() {
  //   const { dispatch } = this.props;
  //   const user = JSON.parse(localStorage.getItem('sword-current-user'))
  //   dispatch(CLASSES_HISTORY_LIST({stationId: user.stationIds[0]}))
  // }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    const user = JSON.parse(localStorage.getItem('sword-current-user'))
    params.startDate = params.startDate ? moment(params.startDate).format(Dateformat) : ''
    params.endDate = params.endDate ? moment(params.endDate).format(Dateformat) : ''
    dispatch(CLASSES_HISTORY_LIST({ ...params }))
  };

  exportTable = () => {
    const { form } = this.tableFunc.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const startDate = fieldsValue.startDate ? moment(fieldsValue.startDate).format(Dateformat) : ''
      const endDate = fieldsValue.endDate ? moment(fieldsValue.endDate).format(Dateformat) : ''
      exportClassesTable({ ...fieldsValue, startDate, endDate })
    })
  }

  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
        <Col md={6} sm={24}>
          <div>
            {/* <Button type="primary" htmlType="submit">查询</Button> */}
            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.exportTable}>
              导出
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  onRef = (ref) => {
    this.tableFunc = ref
  }

  render() {
    const code = 'classes_history';

    const {
      form,
      loading,
      classes: { historyClasses },
    } = this.props;

    const columns = [
      {
        title: '接班时间',
        dataIndex: 'startTime',
      },
      {
        title: '交班时间',
        dataIndex: 'endTime',
      },
      {
        title: '应付金额（元）',
        dataIndex: 'totalOrgPrice',
      },
      {
        title: '油品',
        dataIndex: 'oilCode',
      },
      {
        title: '实付总金额（元）',
        dataIndex: 'totalActualPayPrice',
      },
      {
        title: '加油笔数',
        dataIndex: 'totalCount',
      },
      {
        title: '加油总升数（升）',
        dataIndex: 'totalCapacity',
      },
      {
        title: '退款总金额（元）',
        dataIndex: 'totalReturnPrice',
      },
      {
        title: '退款笔数（笔）',
        dataIndex: 'totalReturnCount',
      },
      {
        title: '退款总升数（升）',
        dataIndex: 'totalReturnCapacity',
      },
      {
        title: '收银员',
        dataIndex: 'cashier',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'opt',
        render: (id) => (
          [<Button type="link" key="1"><Link to={`/classes/list/historyClasses/desc/${id}`}>查看详情</Link></Button>]
        )
      }
    ];

    return (
      <Panel>
        <Button onClick={() => { history.back() }} style={{ marginBottom: 8 }}>返回</Button>
        <Grid
          onRef={this.onRef}
          code={code}
          form={form}
          onSelectRow={false}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={historyClasses}
          columns={columns}
          tblProps={{ rowSelection: false }}
        />
      </Panel>
    );
  }
}
export default HistoryClasses;
