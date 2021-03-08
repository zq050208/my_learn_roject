import React, { Fragment, PureComponent, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Drawer, Select, Table, message, Modal, DatePicker, } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { DEPT_DETAIL, STATION_ONLINE } from '../../../actions/dept';
import { TENANT_LIST } from "../../../actions/tenant";
import { tenantMode } from '../../../defaultSettings';
import moment from 'moment';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import { list as reqStationList, get_oil_priceApi, add_oil_priceApi } from '../../../services/dept';
import StandardTable from '../../../components/StandardTable';
import { getCurrentUser } from '../../../utils/authority';

const FormItem = Form.Item;
const Option = Select.Option;
// 油价配置
const ConfigModal = Form.create()(function (props) {
  const { modalProps, onOkCb, currentItem, fetchData } = props
  const { getFieldDecorator, validateFieldsAndScroll } = props.form;
  const id = fetchData.currentIds[0]
  if (!modalProps.visible) return null
  
  let d = [{ oilNo: 92 }, { oilNo: 95 }, { oilNo: 98 }, { oilNo: 0 }]
  const [defaultData, setData] = useState(d)

  useEffect(() => {
    get_oil_priceApi({ stationId: id }).then(res => {
      if (res.data.length) {
        // 说明缺少条数
        // if (res.data.length < d.length) {
        //   let newData = d.map(item => {
        //     if ()
        //   })
        // }
        setData(res.data)
      }
    })
  }, [])

  function newOk() {
    validateFieldsAndScroll().then(res => {
      // 数据拼合
      let needData = defaultData.map(item => ({ oilNo: item.oilNo, effectiveTime: moment(res.effectiveTime).format('YYYY-MM-DD HH:mm:ss') }))
      for (let key in res) {
        let key1 = key.split('_')[0]  // 真正的字段
        let key2 = key.split('_')[1]
        let value = res[key]
        needData.forEach(item => {
          if (+item.oilNo === +key2) {
            item[key1] = value
          }
        })
      }
      add_oil_priceApi({ oilList: needData, stationId: id }).then(res => {
        message.success(res.msg)
        onOkCb && onOkCb()
      })
    })
  }
  useEffect(() => {
    if (!modalProps.visible) { setData(d) }
  }, [modalProps.visible])


  return (
    <Modal width={800} title="油价配置"  {...modalProps} onOk={newOk}>
      <Form layout="inline">
        <Table bordered={false} columns={[
          {
            title: '国家价',
            dataIndex: 'countryUnitPrice',
            render: (countryUnitPrice, { oilNo }) => (
              <FormItem label={oilNo + '#'}>{getFieldDecorator('countryUnitPrice_' + oilNo,
                {
                  initialValue: countryUnitPrice
                })(<Input />)}
              </FormItem>
            )
          },
          {
            title: '挂牌价',
            dataIndex: 'stationUnitPrice',
            key: '2',
            render: (stationUnitPrice, { oilNo }) => (

              <FormItem>{getFieldDecorator('stationUnitPrice_' + oilNo,
                {
                  initialValue: stationUnitPrice
                }
              )(<Input />)}
              </FormItem>
            )
          },
          {
            title: '优惠价',
            dataIndex: 'actualUnitPrice',
            key: '3',
            render: (actualUnitPrice, { oilNo }) => (
              <FormItem>{getFieldDecorator('actualUnitPrice_' + oilNo, {
                initialValue: actualUnitPrice,
              })(<Input />)}
              </FormItem>
            )
          },
        ]} dataSource={defaultData} bordered pagination={false} />
        <FormItem label="生效时间">{getFieldDecorator('effectiveTime', {
          
          initialValue: (defaultData[0].effectiveTime && moment(defaultData[0].effectiveTime)) || moment()
        })(<DatePicker showTime />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
@connect(({ tenant, loading }) => ({
  tenant,
  loading: loading.models.tenant,
}))
@Form.create()
class Dept extends PureComponent {
  state = {
    visible: false,
    subTabData: {},
    address: '',
    selectedRowKeys: [],
    selectRows: [],
    configModal: false,
    companyId: '',
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
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(TENANT_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    if (this.state.hasSearchCon) {
      return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="商户名称">
              {getFieldDecorator('companyName')(<Input placeholder="请输入商户名称" />)}
            </FormItem>
          </Col>
          {/*<Col md={6} sm={24}>*/}
          {/*  <FormItem label="在线状态">*/}
          {/*    {getFieldDecorator('usable')(*/}
          {/*      <Select>*/}
          {/*        <Option value={1}>上线</Option>*/}
          {/*        <Option value={0}>下线</Option>*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
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
    }
  }

  // 查看油站详情
  handleCheckDetail = (id) => {
    const { dispatch } = this.props;
    dispatch(DEPT_DETAIL(id))
  }

  handleSeePic = (address) => {
    console.log('address', address)
    this.setState({ visible: true, address })
  }

  // 按钮回调
  @Debounce(500)
  handleBtnCallback = (payload) => {
    const { dispatch } = this.props;
    const { btn, keys, rows } = payload;
    // ============ 添加油站 ===============
    if (btn.code === 'dept_station') {
      if (keys.length <= 0) {
        message.warn('请先选择一个商户');
        return;
      }
      if (keys.length > 1) {
        message.warn('只能请先选择一个商户');
        return;
      }
      router.push(`/system/dept/station/add/${rows[0].nodeId}`)
      return;
    }
    // ============ 添加公司 ===============
    if (btn.code === 'dept_company') {
      router.push(`/system/dept/company/add`)
      return;
    }
    // 批量下线
    if (btn.code === 'dept_offline') {
      this.handleOnLine(0)
      return
    }
    if (btn.code === 'dept_online') {
      this.handleOnLine(1)
      return
    }
    // 配置油价
    if (btn.code === 'add_price') {
      return this.handlePrice()
    }
  }
  handlePrice = () => {
    if (this.state.selectRows.length !== 1) {
      return message.error('请保持选择一个油站')
    }
    const currentId = this.state.selectRows[0]
    this.setState({ configModal: true })
  }

  // 子表格编辑
  handleEdit = (record) => {
    // const { dispatch } = this.props;
    // dispatch(DEPT_DETAIL(record.nodeId))
    router.push(`/system/dept/stationEdit/${record.nodeId}`)
  }

  // 删除油站
  handleDelete = (deptId) => {
    const { dispatch } = this.props;
    const that = this;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        console.log('deptId', deptId)

        dispatch(DEPT_REMOVE({
          data: { ids: deptId }, success: () => {
            that.handleSearch()
          }
        }))
      },
      onCancel() { },
    });
  }

  handleOnLine = (status) => {
    console.log('ssss', status)
    const { dispatch } = this.props;
    const { subTabData, companyId } = this.state;
    if (Object.keys(status).includes('usable')) {
      return dispatch(STATION_ONLINE({ data: { ids: [status.id], usable: status.usable ? 0 : 1 }, success: () => {
          reqStationList({ nodeId: companyId })
            .then(res => {
              console.log('加油站列表', res)
              this.setState({
                subTabData: {
                  ...subTabData,
                  [companyId]: res.data
                }
              })
            })
        } }))
    }
    if (this.state.selectedRowKeys.length === 0) {
      return message.error('请选择公司或油站！')
    }
    dispatch(STATION_ONLINE({ data: { ids: this.state.selectRows, usable: status }, success: () => {
        reqStationList({ nodeId: companyId })
          .then(res => {
            console.log('批量上下线后加油站列表', res)
            this.setState({
              subTabData: {
                ...subTabData,
                [companyId]: res.data
              }
            })
          })
      } }))
  }

  // renderLeftButton = () => (
  //   <Fragment>
  //     <Button type="danger" icon="tool" onClick={this.handleOnLine.bind(this, '0')}>
  //       批量下线
  //     </Button>
  //     <Button type="primary" icon="tool" onClick={this.handleOnLine.bind(this, '1')}>
  //       批量上线
  //     </Button>
  //   </Fragment>
  // );



  onRef = ref => {
    this.tableFunc = ref
  }

  onSelectChange = (selectedRowKeys, selectRowsArr) => {
    console.log('-----', selectedRowKeys, selectRowsArr)
    let selectRows = selectRowsArr.map(item => item.id)
    setTimeout(() => {
      this.setState({ selectedRowKeys, selectRows })
    }, 0)

  }

  handleSelectRow = (rows) => {
    console.log('fsss', rows)
    let selectedRowKeys = rows.map(item => item.nodeId)

    if (!rows.length) {
      this.setState(state => {
        return {
          ...state,
          selectedRowKeys: []
        }
      })
    }
    let arr = []
    selectedRowKeys.map(nodeId => {
      reqStationList({ nodeId })
        .then(res => {
          res.data.records.length && selectedRowKeys.concat(res.data.records.map(item => item.nodeId))
          console.log('加油站', selectedRowKeys.concat(res.data.records.map(item => item.nodeId)))
          let newRowKeys = selectedRowKeys.concat(res.data.records.map(item => item.nodeId))
          console.log('se', newRowKeys)
          arr = arr.concat(newRowKeys)
          console.log('afsfsf', arr)
          this.setState(state => {
            return {
              ...state,
              selectedRowKeys: [...arr]
            }
          })
        })


    })

    // rows.map(item => {
    //   const deptIds = Array.from(item.stationList, (item) => item.nodeId)
    //   selectedRowKeys = selectedRowKeys.concat(deptIds)
    // })

  }

  handleStationPageChange = (pagination, ...arg) => {
    console.log(pagination, ...arg)
    console.log(this.state.companyId)
    const { subTabData } = this.state;
    reqStationList({ nodeId: this.state.companyId, current: pagination.current, size: pagination.pageSize })
      .then(res => {
        this.setState({
          subTabData: {
            ...subTabData,
            [this.state.companyId]: res.data
          }
        })
      })
  }

  render() {
    const code = 'dept';

    const {
      form,
      loading,
      // dept: { data, detail },
      tenant: { data },
    } = this.props;

    const {
      visible,
      address,
    } = this.state;

    const columns = [
      {
        title: '商户编号',
        dataIndex: 'companyNo',
      },
      {
        title: '商户名称',
        dataIndex: 'companyName',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
      },
      {
        title: '联系邮箱',
        dataIndex: 'email',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        key: 'stationCount',
        title: '旗下加油站数',
        dataIndex: 'stationCount',
      },
      {
        title: '线上加油站数',
        dataIndex: 'onlineStationCount',
      },
      // {
      //   title: '详情',
      //   render: () => {
      //     return (
      //       <a href="">详情</a>
      //     )
      //   }
      // }
    ];
    const stationColumns = [
      {
        title: '加油站编号',
        dataIndex: 'stationNo',
        key: 'stationNo'
      },
      {
        title: '油站名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '省份',
        dataIndex: 'province',
        key: 'province'
      },
      {
        title: '城市',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: '县/区',
        dataIndex: 'county',
        key: 'county'
      },
      {
        title: '纬度',
        dataIndex: 'latitude',
        key: 'latitude'
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        key: 'longitude'
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        key: 'linkman'
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '在线状态',
        render: (record) => {
          return <a onClick={this.handleOnLine.bind(this, record)}>{record.usable === 1 ? '上线' : '下线'}</a>
        }
      },
      {
        title: '92#',
        dataIndex: '92',
        children: [
          {
            title: '挂牌价',
            key: 'a',
            render: (record) => record.stationUnitPrice92
          },
          {
            title: '国家价',
            key: 'b',
            render: (record) => record.countryUnitPrice92
          }
        ]
      },
      {
        title: '95#',
        dataIndex: '95',
        children: [
          {
            title: '挂牌价',
            key: 'c',
            render: (record) => record.stationUnitPrice95
          },
          {
            title: '国家价',
            key: 'd',
            render: (record) => record.countryUnitPrice95
          }
        ]
      },
      {
        title: '98#',
        dataIndex: '98',
        children: [
          {
            title: '挂牌价',
            key: 'e',
            render: (record) => record.stationUnitPrice98
          },
          {
            title: '国家价',
            key: 'f',
            render: (record) => record.countryUnitPrice98
          }
        ]
      },
      {
        title: '0#',
        dataIndex: '0',
        children: [
          {
            title: '挂牌价',
            key: 'g',
            render: (record) => record.stationUnitPrice0
          },
          {
            title: '国家价',
            key: 'h',
            render: (record) => record.countryUnitPrice0
          }
        ]
      },
      {
        title: '操作',
        width: 100,
        render: (record) => (
          <Fragment>
            <a style={{ marginRight: 8 }} onClick={this.handleEdit.bind(this, record)}>修改</a>
            {/* <a onClick={this.handleDelete.bind(this, record.deptId)}>删除</a> */}
            {/*<a onClick={this.handleDec.bind(this, record.deptId)}>详情</a>*/}
          </Fragment>
        )
      },
    ];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const expandProps = {
      onExpand: (expanded, record) => {
        console.log('11111');
        const { dispatch } = this.props;
        const { subTabData } = this.state;
        if (expanded === false) {
          this.setState({
            companyId: record.nodeId,
            subTabData: {
              ...subTabData,
              [record.nodeId]: [],
            }
          })
        } else {
          // const { selectedRows } = this.tableFunc.state;
          // this.tableFunc.handleSelectRows([record]);
          reqStationList({ nodeId: record.nodeId })
            .then(res => {
              console.log('加油站列表', res)
              this.setState({
                companyId: record.nodeId,
                subTabData: {
                  ...subTabData,
                  [record.nodeId]: res.data
                }
              })
            })
        }
      },
      expandedRowRender: record => {
        console.log('张开1111', record, this.state.subTabData)
        const tableData = this.state.subTabData[record.nodeId] || []
        return <StandardTable
                rowKey="nodeId"
                rowSelection={rowSelection}
                columns={stationColumns}
                data={{list: tableData.records, pagination: {
                    total: tableData.total,
                    current:tableData.current,
                    pageSize: tableData.size,}}}
                onChange={this.handleStationPageChange}
                  />
        // return <Table
        //   rowKey="nodeId"
        //   rowSelection={rowSelection}
        //   columns={stationColumns}
        //   dataSource={tableData.records}
        //   pagination={{total: tableData.total, pageSize: tableData.size}}/>
      },
      // expandRowByClick: true
    }

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel>
        <Grid
          rowKey="nodeId"
          onRef={this.onRef}
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          // renderLeftButton={this.renderLeftButton}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 2000 }}
          onSelectRow={this.handleSelectRow}
          // tblProps={{childrenColumnName: "stationList"}}
          expandProps={expandProps}
          btnCallBack={this.handleBtnCallback}
        />
        <Modal
          title="查看图片"
          visible={visible}
          footer={null}
          onCancel={() => { this.setState({ visible: false }) }}>
          {
            address ? <img src={address} style={{ width: 200, height: 200 }} /> : '暂无图片'
          }
        </Modal>
        <ConfigModal
          fetchData={{ currentIds: this.state.selectRows }}
          onOkCb={() => this.setState({ configModal: false })}
          modalProps={{
            visible: this.state.configModal,
            onCancel: () => {
              this.setState({
                configModal: false
              })
            }
          }}></ConfigModal>
      </Panel>
    );
  }
}
export default Dept;
