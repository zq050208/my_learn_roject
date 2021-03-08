import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Row, DatePicker, message } from 'antd';
import Panel from '../../../components/Panel';
import { HISTORY_LIST } from '../../../actions/oilPrice';
import { tenantMode } from '../../../defaultSettings';
import router from 'umi/router';
import Grid from '@/components/Sword/Grid';
import moment from 'moment';
import { OILPRICE_HISTORY_EXPORT } from '@/actions/oilPrice';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ oilPrice, loading }) => ({
  oilPrice,
  loading: loading.models.oilPrice,
}))
@Form.create()
class OilPriceHistory extends PureComponent {
  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch, match: { params: { stationId } } } = this.props;
    const startDate = moment(params.startDate).format(dateFormat);
    const endDate = moment(params.endDate).format(dateFormat);
    dispatch(HISTORY_LIST({...params, startDate, endDate, stationId}));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="时间">
            {getFieldDecorator('startDate', {
              initialValue: moment(new Date(), dateFormat)
            })(<DatePicker showTime />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="至">
            {getFieldDecorator('endDate', {
              initialValue: moment(new Date(), dateFormat)
            })(<DatePicker showTime />)}
          </FormItem>
        </Col>
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
    );
  };

  // ============ 按钮回调 ===============
  handleBtnCallback = (payload) => {
    console.log('ddd')
    const { btn, keys } = payload;
    if (btn.code === 'oilPrice_history_export') {
      const { dispatch, match: { params: { stationId } }, oilPrice: { history } } = this.props;
      if (!history.list.length) { return message.error('暂无数据导出！') }
      const { form } = this.tableFunc.props;
      const { current, size } = this.tableFunc.state;
      form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        const startDate = moment(fieldsValue.startDate).format(dateFormat)
        const endDate = moment(fieldsValue.endDate).format(dateFormat)
        dispatch(OILPRICE_HISTORY_EXPORT({...fieldsValue, startDate, endDate, current, size, stationId}))
      })
    }
  };


  onRef = (ref) => {
    this.tableFunc = ref
  }

  render() {
    const code = 'oilPrice';

    const {
      form,
      loading,
      oilPrice: { history },
    } = this.props;

    const columns = [
      {
        title: '加油站ID',
        dataIndex: 'stationId',
      },
      {
        title: '加油站名称',
        dataIndex: 'stationName',
      },
      {
        title: '状态',
        dataIndex: 'stationStatus',
        render: (text) => {
          if (text === 1) return '上架'
          else return '下架'
        }
      },
      {
        title: '92#',
        children: [
          {
            title: '挂牌价',
            dataIndex: 'oil92StationUnitPrice'
          },
          {
            title: '优惠价',
            dataIndex: 'oil92ActualUnitPrice'
          },
          {
            title: '国家价',
            dataIndex: 'oil92CountryUnitPrice'
          },
        ]
      },
      {
        title: '95#',
        children: [
          {
            title: '挂牌价',
            dataIndex: 'oil95StationUnitPrice'
          },
          {
            title: '优惠价',
            dataIndex: 'oil95ActualUnitPrice'
          },
          {
            title: '国家价',
            dataIndex: 'oil95CountryUnitPrice'
          },
        ]
      },
      {
        title: '98#',
        children: [
          {
            title: '挂牌价',
            dataIndex: 'oil98StationUnitPrice'
          },
          {
            title: '优惠价',
            dataIndex: 'oil98ActualUnitPrice'
          },
          {
            title: '国家价',
            dataIndex: 'oil98CountryUnitPrice'
          },
        ]
      },
      {
        title: '0#',
        children: [
          {
            title: '挂牌价',
            dataIndex: 'oil0StationUnitPrice'
          },
          {
            title: '优惠价',
            dataIndex: 'oil0ActualUnitPrice'
          },
          {
            title: '国家价',
            dataIndex: 'oil0CountryUnitPrice'
          },
        ]
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
    ];


    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel>
        <Grid
          rowKey="stationId"
          onRef={this.onRef}
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallback}
          loading={loading}
          data={history}
          columns={columns}
          tblProps={{ rowSelection: false }}
        />

      </Panel>
    );
  }
}
export default OilPriceHistory;
