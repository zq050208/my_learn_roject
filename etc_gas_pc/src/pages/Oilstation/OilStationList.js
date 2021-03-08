import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Button, Col, Form, Input, Row, DatePicker, message, Divider, Modal} from 'antd';
import Panel from '../../components/Panel';
import { OIL_STATION_LIST } from '../../actions/oilstation';
import { } from '../../services/oilstation';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;
const Dateformat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ oilstation, loading }) => ({
  oilstation,
  loading: loading.models.oilstation,
}))
@Form.create()
class OilStationList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shiftTime: '',
      endTime: ''
    }
  }

  async componentDidMount() {
    
  }

  // ============ 查询 ===============
  handleSearch = (params = {}) => {
    const { dispatch } = this.props;
    console.log("params:", params)
    dispatch(OIL_STATION_LIST({ ...params }));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="站点关键字">
            {getFieldDecorator('gasStationName')(<Input placeholder="请输入站点关键字" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="编号">
            {getFieldDecorator('gasStationCode',{
              rules: [
                { pattern: new RegExp(/^[0-9]+$/, "g") , message: '编号只允许包含数字'}
              ]
            })(<Input placeholder="请输入编号" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="地址关键字">
            {getFieldDecorator('address')(<Input placeholder="请输入地址关键字" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查找
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  @Debounce(500)
  handleBtnCallBack = async payload => {
    
  }

  checkContent = (value) => {
    return Boolean(value.trim())
  }

  onRef = (ref) => {
    this.tableFunc = ref
  }
  // 查看
  viewDetail = (text) => {
    console.log('view',this)
    this.props.history.push({pathname:'/oilstation/view/'+text.gasStationId+''})
  }
  // 删除
  delete = (text) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        // console.log('deptId', deptId)

        // dispatch(DEPT_REMOVE({
        //   data: { ids: deptId }, success: () => {
        //     that.handleSearch()
        //   }
        // }))
      },
      onCancel() { },
    });
  }
  render() {
    const code = 'oilstation';

    const {
      form,
      loading,
      oilstation: { data },
    } = this.props;
    const columns = [
      {
        title: '油站编号',
        dataIndex: 'gasStationId',
        width: 100,
      },
      {
        title: '油站名称',
        dataIndex: 'gasStationName',
        width: 100,
      },
      {
        title: '省份',
        dataIndex: 'provinceCnt',
        width: 100,
      },
      {
        title: '地市',
        dataIndex: 'cityCnt',
        width: 100,
      },
      {
        title: '区',
        dataIndex: 'countyCnt',
        width: 100,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 100,
      },
      {
        title: '油站图片',
        // dataIndex: 'gasStationImg',
        width: 100,
        render: (text) => {
          return (
            <img src={ text.gasStationImg }/>
          )
        }
      },
      {
        title: '等级',
        dataIndex: 'gasStationType',
        width: 100,
      },
      {
        title: '油机数量',
        dataIndex: 'fillingMachineNum',
        width: 100,
      },
      {
        title: '锁定',
        dataIndex: 'totalReturnCapacity',
        width: 100
      },
      {
        title: '编辑',
        // dataIndex: 'totalCount',
        width: 100,
        render: (text) => {
          return (
            <div>
              <Button type="primary" onClick={this.viewDetail.bind(this,text)} size="small">查看</Button>
              <Button type="danger" onClick={this.delete.bind(this,text)} size="small">删除</Button>
            </div>
            )
        }
      }
    ];

    return (
      <Panel>
        <Grid
          rowKey="gasStationId"
          code={code}
          form={form}
          onRef={this.onRef}
          tblProps={{ rowSelection: false }}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
      </Panel>
    );
  }
}
export default OilStationList;
