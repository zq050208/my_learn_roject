import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, DatePicker, message, Divider } from 'antd';
import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import { CLASSES_HISTORY_LIST } from '@/actions/classes';
import { exportClassesTable, currentClassesdetailApi } from '@/services/classes';

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
  state = {
    data: {
      list: [],
      pagination: false,
    },
  }
  // async componentDidMount() {
  //   const { dispatch } = this.props;
  //   const user = JSON.parse(localStorage.getItem('sword-current-user'))
  //   dispatch(CLASSES_HISTORY_LIST({stationId: user.stationIds[0]}))
  // }

  // ============ 查询 ===============
  handleSearch = params => {
    currentClassesdetailApi({ ...params, ...this.props.match.params }).then(response => {
      this.setState({
        data: {
          list: response.data.records,
          pagination: {
            total: response.data.total,
            current: response.data.current,
            pageSize: response.data.size,
          },
        }
      })
    })

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


  componentDidMount() {

  }

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
    const { data } = this.state
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
        title: '油号',
        dataIndex: 'oilNo',
      },
      {
        title: '应付金额（元）',
        dataIndex: 'totalOrgPrice',
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
        title: '加油员',
        dataIndex: 'createByStr',
      },

    ];

    return (
      <Panel>
        <Button onClick={() => { history.back() }} style={{ marginBottom: 8 }}>返回</Button>
        <Grid
          onRef={this.onRef}
          code={code}
          form={form}
          onSelectRow={false}
          renderSearchForm={() => { }}
          onSearch={this.handleSearch}
          loading={loading}
          data={data}
          columns={columns}
          tblProps={{ rowSelection: false }}
        />
      </Panel>
    );
  }
}
export default HistoryClasses;
