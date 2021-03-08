import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {Button, Col, Form, Input, Row, DatePicker, message, Divider, Modal} from 'antd';
import Panel from '../../components/Panel';
import { ANTENNA_LIST } from '../../actions/antenna';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;
const AddNewOilModal = Form.create()(function (props) {
  let { form, modalProps } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const formData = form.getFieldsValue()
  function newOk(){
    modalProps.updateParent()
  }
  function newCancel(){
    form.resetFields();
    modalProps.updateParent()
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  return (
    <Modal width={800} title="添加天线"  {...modalProps} onOk={newOk} onCancel={newCancel}>
      <Row>
        <Form {...layout}>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="天线编号">
                {getFieldDecorator('antennaId',{
                  rules: [
                    {required: true, message: '天线编号'},
                    { pattern: new RegExp(/^[0-9]+$/, "g") , message: '编号只允许包含数字'}
                  ],
                  initialValue: modalProps.antennaId})(<Input placeholder="天线编号" onChange={modalProps.antennaId} autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="供应商">
                {getFieldDecorator('supplier',{
                  rules: [{required: true, message: '请输入供应商'}],
                  initialValue: modalProps.supplier})(<Input placeholder="供应商" autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="型号">
              {getFieldDecorator('model',{
                rules: [
                  { required: true, message: '请输入型号'},
                ],
                initialValue: modalProps.model})(<Input placeholder="型号" autoComplete="off" maxLength="10"/>)}
              </FormItem>
            </Col>
            {/* <Col span={12}>
              <FormItem label="油品" >
                {getFieldDecorator('oilsVarieties',{
                  rules: [{required: true, message: '请输入油品'}],
                  initialValue: modalProps.oilsVarieties})(<Input placeholder="油品" autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col> */}
          </Row>
        </Form>
      </Row>
    </Modal>
  );
})
@connect(({ antenna, loading }) => ({
  antenna,
  loading: loading.models.order,
}))

@Form.create()
class antennaList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      antennaId: '', //天线编号
      supplier: '', //供应商
      model: '', //型号
    }
  }

  async componentDidMount() {
    
  }

  // ============ 查询 ===============
  handleSearch = (params = {}) => {
    const { dispatch } = this.props;
    console.log("params:", params)
    dispatch(ANTENNA_LIST({ ...params }));
  };
  addAntenna = () => {
    this.setState({
      modalVisible: true,
    })
  }
  updateParent = () => {
    this.setState({
      modalVisible: false,
    })
  }
  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log("form",form)
    return (
      <>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="天线所在站点">
              {getFieldDecorator('gasStationName')(<Input placeholder="请输入站点关键字" autoComplete="off" maxLength="30"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="编号">
            {/* /^[0-9]+$/ */}
              {getFieldDecorator('gasStationId',{
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
        <Row>
          <Col>
            <div style={{ float: 'right' }}>
              <Button type="primary" onClick={ this.addAntenna }>
                添加天线
              </Button>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  @Debounce(500)
  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = async payload => {
    console.log("btn click")
  }

  // checkContent = (value) => {
  //   return Boolean(value.trim())
  // }

  onRef = (ref) => {
    this.tableFunc = ref
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
    const code = 'antenna';

    const {
      form,
      loading,
      antenna: { data },
    } = this.props;
    console.log("antenna",this.props)
    const columns = [
      {
        title: '油站编号',
        dataIndex: 'gasStationId',
        width: 100,
      },
      {
        title: '天线所在油站',
        dataIndex: 'gasStationName',
        width: 100,
      },
      {
        title: '天线编号',
        dataIndex: 'antennaId',
        width: 100,
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        width: 100,
      },
      {
        title: '型号',
        dataIndex: 'model',
        width: 100,
      },
      {
        title: '天线状态',
        width: 100,
        render: (text) => {
          switch(text.antennaStatus){
            case 1:
              return <span>运行中</span>
              break;
            case 2:
              return <span>已停止</span>
              break;
            case 3:
              return <span>异常</span>
          }
        }
      },
      {
        title: '锁定',
        dataIndex: 'totalCapacity',
        width: 100,
      },
      {
        title: '编辑',
        // dataIndex: 'totalCount',
        width: 100,
        render: (text) => {
          return (
            <div>
              <Button type="danger" onClick={this.delete.bind(this,text)} size="small">删除</Button>
            </div>
            )
        }
      }
    ];

    return (
      <Panel>
        <Grid
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
        <AddNewOilModal
          modalProps={{
            visible: this.state.modalVisible,
            antennaId: this.state.antennaId,
            supplier: this.state.supplier,
            model: this.state.model,
            updateParent: this.updateParent
          }}
        ></AddNewOilModal>
      </Panel>
    );
  }
}
export default antennaList;
