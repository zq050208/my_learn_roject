import React, { Fragment, PureComponent, useState } from 'react';
import { connect } from 'dva';
import {Button, Col, Form, Input, Row, DatePicker, message, Divider, Modal, Cascader, Select } from 'antd';
import Panel from '../../components/Panel';
import { ADD_OIL_DETAIL, ADD_GAS_MACHINE } from '../../actions/addOilSta';
import { addGasMachine, editGasMachine } from '../../services/addOilSta';
import Grid from '../../components/Sword/Grid';
import router from 'umi/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;

const AddNewOilModal = Form.create()(function (props) {
  let { form, modalProps } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const formData = form.getFieldsValue()
  const { gasStationId, type, fillingMachineId } = modalProps
  function newOk(){
    if(type === 'add'){
      const params = {
        ...formData,
        gasStationId
      }
      validateFieldsAndScroll().then(res => {
        addGasMachine(params).then(res => {
          if(+res.code === 0){
            form.resetFields();
            message.success("添加成功")
            modalProps.updateParent()
          }
        })
      })
    } else {
      const params = {
        ...formData,
        gasStationId,
        fillingMachineId
      }
      validateFieldsAndScroll().then(res => {
        editGasMachine(params).then(res => {
          if(+res.code === 0){
            form.resetFields();
            message.success("修改成功")
            modalProps.updateParent()
          }
        })
      })
    }
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
    <Modal width={800} title="添加加油机"  {...modalProps} onOk={newOk} onCancel={newCancel}>
      <Row>
        <Form {...layout}>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="加油机名称">
                {getFieldDecorator('fillingMachineName',{
                  rules: [{required: true, message: '请输入加油机名称'}],
                  initialValue: modalProps.fillingMachineName})(<Input placeholder="加油机名称" onChange={modalProps.fillingMachineName} autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="油机识别码">
                {getFieldDecorator('fillingMachineCode',{
                  rules: [{required: true, message: '请输入油机识别码'}],
                  initialValue: modalProps.fillingMachineCode})(<Input placeholder="油机识别码" autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="加油枪数量">
              {getFieldDecorator('oilGunNum',{
                rules: [
                  { required: true, message: '请输入加油枪数量'},
                  { pattern: new RegExp(/^[0-9]+$/, "g") , message: '加油枪数量只允许包含数字'}
                ],
                initialValue: modalProps.oilGunNum})(<Input placeholder="加油枪数量" autoComplete="off" maxLength="10"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="油品" >
                {getFieldDecorator('oilsVarieties',{
                  rules: [{required: true, message: '请输入油品'}],
                  initialValue: modalProps.oilsVarieties})(<Input placeholder="油品" autoComplete="off" maxLength="30"/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Row>
    </Modal>
  );
})
@connect(({ addOilSta, loading }) => ({
  addOilSta,
  loading: loading.models.addOilSta,
}))
@Form.create()
class addOilStaList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      fillingMachineName: '', //加油机名称
      fillingMachineCode: '', //油机识别码
      fillingMachineId: '', //加油机编号
      oilGunNum: '', //油枪数量
      oilsVarieties: '', //油品
      gasStationId: 0, //油站编号
      type: 'add'
    }
  }
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    this.setState({
      gasStationId: id
    })
    dispatch(ADD_OIL_DETAIL({gasStationId: id}));
  }
  async componentDidMount() {
    
  }

  // ============ 查询 ===============

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const groups = [{groupCode: 1, groupName: 'A类站点'},{groupCode: 2, groupName: 'B类站点'}]
    const {
      addOilSta: {
        detail
      },
    } = this.props;
    const options = [
      {
        value: '广东省',
        label: '广东省',
        children: [
          {
            value: '深圳市',
            label: '深圳市',
            children: [
              {
                value: '南山区',
                label: '南山区',
              },
            ],
          },
          {
            value: '广州市',
            label: '广州市',
            children: [
              {
                value: '越秀区',
                label: '越秀区',
              },
            ],
          },
        ],
      },
      {
        value: '山西省',
        label: '山西省',
        children: [
          {
            value: '运城市',
            label: '运城市',
            children: [
              {
                value: '盐湖区',
                label: '盐湖区',
              },
            ],  
          },
          {
            value: '太原市',
            label: '太原市',
            children: [
              {
                value: '小店区',
                label: '小店区',
              },
              {
                value: '晋源区',
                label: '晋源区',
              },
              {
                value: '杏花岭区',
                label: '杏花岭区',
              },
            ],  
          },
        ],
      },
    ];
    return (
      <>  
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="油站名称">
            {getFieldDecorator('gasStationName',{initialValue: detail.gasStationName})(<Input placeholder="请输入油站名称" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="油站类型">
            {getFieldDecorator('gasStationType',{initialValue: detail.gasStationType})(
              <Select placeholder="请选择油站类型">
                {
                  groups.length && groups.map(group => (
                    <Option key={ group.groupCode } value={ group.groupCode }>{ group.groupName }</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="归属主体">
            {getFieldDecorator('subject',{initialValue: detail.subject})(<Input placeholder="请输入归属主体" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="油站识别码">
            {getFieldDecorator('gasStationCode',{initialValue: detail.gasStationCode})(<Input placeholder="请输入油站识别码" autoComplete="off" maxLength="30"/>)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="所在省份">
            {getFieldDecorator('adress',{initialValue: [detail.provinceCnt, detail.cityCnt, detail.countyCnt]})(
              <Cascader
                options={options}
                onChange={this.onChange}
              />,
            )}
          </FormItem>
        </Col>  
        <Col md={6} sm={24}>
          <FormItem>
            {getFieldDecorator('address',{initialValue: detail.address})(
              <Input placeholder="请输入详细地址" autoComplete="off" maxLength="30"/>
            )}
          </FormItem>
        </Col>  
      </Row>
      <Row>
        <Col>
          <div style={{ float: 'left', fontSize: '16px' }}>加油机信息</div>
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={ this.addNewOil }>
              添加油机
            </Button>
          </div>
        </Col>
      </Row>
      </>
    );
  };

  @Debounce(500)
  handleBtnCallBack = async payload => {
    
  }
  onChange = (val) => {
    console.log(val)
  }
  addNewOil = () => {
    this.setState({
      modalVisible: true,
      fillingMachineName: '',
      fillingMachineCode: '',
      oilGunNum: '',
      oilsVarieties: '',
      gasStationId: this.state.gasStationId,
      type: 'add'
    })
    
  }
  checkContent = (value) => {
    return Boolean(value.trim())
  }

  onRef = (ref) => {
    this.tableFunc = ref
  }
  // 删除
  delete = (text) => {
    console.log("11",text)
  }
  // 编辑
  edit = (text) => {
    this.setState({
      modalVisible: true,
      fillingMachineName: text.fillingMachineName,
      fillingMachineCode: text.fillingMachineCode,
      oilGunNum: text.oilGunNum,
      oilsVarieties: text.oilsVarieties,
      gasStationId: this.state.gasStationId,
      type: 'edit',
      fillingMachineId: text.fillingMachineId
    })
  }
  updateParent = () => {
    this.setState({
      modalVisible: false,
    })
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(ADD_OIL_DETAIL({gasStationId: id}));
  }
  render() {
    const code = 'addOilSta';

    const {
      form,
      loading,
      addOilSta: { data },
    } = this.props;
    const columns = [
      {
        title: '加油机编号',
        dataIndex: 'fillingMachineId',
        width: 100,
      },
      {
        title: '加油机名称',
        dataIndex: 'fillingMachineName',
        width: 100,
      },
      {
        title: '油枪数量',
        dataIndex: 'oilGunNum',
        width: 100,
      },
      {
        title: '支持油品',
        dataIndex: 'oilsVarieties',
        width: 100,
      },
      {
        title: '油机识别码',
        dataIndex: 'fillingMachineCode',
        width: 100,
      },
      {
        title: '加油位',
        dataIndex: 'refuelingPosition',
        width: 100,
      },
      {
        title: '编辑',
        width: 100,
        render: (text) => {
          return (
            <>
              <Button type="primary" onClick={this.edit.bind(this,text)} size="small">编辑</Button>
              <Button type="danger" onClick={this.delete.bind(this,text)} size="small">删除</Button>
            </>
            )
        }
      }
    ];

    return (
      <Panel>
        <Grid
          rowKey="fillingMachineId"
          code={code}
          form={form}
          onRef={this.onRef}
          tblProps={{ rowSelection: false }}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
        <AddNewOilModal
          modalProps={{
            visible: this.state.modalVisible,
            fillingMachineName: this.state.fillingMachineName,
            fillingMachineCode: this.state.fillingMachineCode,
            oilGunNum: this.state.oilGunNum,
            oilsVarieties: this.state.oilsVarieties,
            gasStationId: this.state.gasStationId,
            type: this.state.type,
            fillingMachineId: this.state.fillingMachineId,
            updateParent: this.updateParent
          }}
        ></AddNewOilModal>
      </Panel>
    );
  }
}
export default addOilStaList;
