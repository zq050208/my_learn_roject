import React, { Fragment, PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Upload,
  Switch,
  Modal,
} from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { DEPT_UPDATE, DEPT_CLEAR_DETAIL } from '../../../actions/dept';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {uploadFile} from "@/services/api";
import Debounce from 'lodash-decorators/debounce';
import { getNewOilPrice } from "../../../services/oilPrice";
import { detail as getStationDetail, setOilPriceStatus } from '../../../services/dept';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class DeptAdd extends PureComponent {
  state = {
    loading: false,
    fileList: [],
    oilGunList: [
      {
        oilNo: '92',
        oilGun: '',
      },
      {
        oilNo: '95',
        oilGun: ''
      },
      {
        oilNo: '98',
        oilGun: ''
      },
      {
        oilNo: '0',
        oilGun: ''
      }
    ],
    oilNoList: [
      {
        oilNo: '92',
        checked: ''
      },
      {
        oilNo: '95',
        checked: ''
      },
      {
        oilNo: '98',
        checked: ''
      },
      {
        oilNo: '0',
        checked: ''
      }
    ],
    checkA: false,
    checkB: false,
    checkC: false,
    checkD: false,
    businessLicenseUrl: '',
    openBusinessUrl: '',
    logo: '',
    newOilPrice: [],
    detail: {},
    visible: false
  }

  componentDidMount() {
    const { match: { params: { nodeId } } } = this.props;

    getStationDetail({ nodeId })
      .then(res => {
        console.log('sfsfds', res)
        this.setState(state => {
          return {
            ...state,
            detail: res.data,
            businessLicenseUrl: res.data.businessLicenseUrl,
            openBusinessUrl: res.data.openBusinessUrl,
            logo: res.data.logo
          }
        })
      })
  }

  @Debounce(500)
  handleSubmit = e => {
    e.preventDefault();
    const { detail, logo, businessLicenseUrl, openBusinessUrl } = this.state;
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {...detail, ...values, logo, businessLicenseUrl, openBusinessUrl }
        dispatch(DEPT_UPDATE(params));
      }
    });
  };

  handleSwitchChange = (oilCheck, checked) => {
    console.log('oilCheck', oilCheck)
    this.setState(state => {
      return {
        ...state,
        visible: true,
        [oilCheck]: checked,
        currentOilNo: oilCheck
      }
    })
  }

  handleChange = () => {
    const { detail, currentOilNo } = this.state
    console.log('this.state.oilNo', this.state[currentOilNo])
    setOilPriceStatus({ oilNo: currentOilNo, stationId: detail.id, status: Number(this.state[currentOilNo]) })
      .then(res => {
        console.log('res', res)
        detail.oilList.map(item => {
          if (item.oilNo === currentOilNo) {
            item.status = Number(this.state[currentOilNo])
          }
        })
        this.setState(state => {
          return {
            ...state,
            visible: false,
            detail
          }
        })
      })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleIptChange = (oilNo, e) => {
    const { oilGunList } = this.state;
    const oilNoCheck = oilGunList.filter((item) => (item.oilNo === oilNo))[0]
    oilNoCheck.oilGun = e.target.value
    this.setState(state => {
      return {
        ...state,
        oilGunList: [...new Set([...oilGunList, oilNoCheck])]
      }
    })
  }

  handleAddOilGun = (oilCheck, e) => {
    console.log(oilCheck, e.target.value)
    let val = e.target.value;
    val = val.replace(/[^\d\,]/g,'');
    this.setState(state => {
      const { detail } = state;
      detail.oilList.map(item => {
        if (item.oilNo === oilCheck) {
          item.oilGun = val;
        }
      });
      return {
        detail: {
          ...detail,
          oilList: detail.oilList
        }
      }
    })
  }

  checkContent = (rule, value, callback) => {
    const reg = /^([1-9]{1})(\d{15}|\d{18})$/;
    if (!reg.test(value)) {
      callback('请输入16位或19位的银行卡号');
      return;
    }
    callback()
  }

  handleImg1Change = (code, info) => {
    console.log(code, info)
    if(info.file) {
      const formData = new FormData();
      formData.append('files', info.file);
      uploadFile(formData).then(res => {
        console.log('图片返回成功', res)
        this.setState({
          [code]: res.data.url[0]
        })
      })
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      dept: {
        init: { tree },
      },
      submitting,
    } = this.props;


    const { imageUrl, checkA, checkB, checkC, checkD, detail, newOilPrice } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );


    return (
      <Panel title="修改" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="加油站名称">
                  {getFieldDecorator('name', {
                    initialValue: detail.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入加油站名称',
                      },
                    ],
                  })(<Input placeholder="请输入加油站名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="省份">
                  {getFieldDecorator('province', {
                    initialValue: detail.province,
                    rules: [
                      {
                        required: true,
                        message: '请输入省份',
                      },
                    ],
                  })(
                    <Input placeholder="请输入省份" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="城市">
                  {getFieldDecorator('city', {
                    initialValue: detail.city,
                    rules: [
                      {
                        required: true,
                        message: '请输入城市',
                      },
                    ],
                  })(<Input placeholder="请输入城市" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="县/区">
                  {getFieldDecorator('county', {
                    initialValue: detail.county,
                    rules: [
                      {
                        required: true,
                        message: '请输入县/区',
                      },
                    ],
                  })(
                    <Input placeholder="请输入县/区" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="地址">
                  {getFieldDecorator('address', {
                    initialValue: detail.address,
                    rules: [
                      {
                        required: true,
                        message: '请输入地址',
                      },
                    ],
                  })(<Input placeholder="请输入地址" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="银行名称">
                  {getFieldDecorator('bankName', {
                    initialValue: detail.bankName,
                    rules: [
                      {
                        required: true,
                        message: '请输入银行名称',
                      },
                    ],
                  })(
                    <Input placeholder="请输入银行名称" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="开户行">
                  {getFieldDecorator('accountBank', {
                    initialValue: detail.accountBank,
                    rules: [
                      {
                        required: true,
                        message: '请输入开户行',
                      },
                    ],
                  })(<Input placeholder="请输入开户行" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="银行卡号">
                  {getFieldDecorator('account', {
                    initialValue: detail.account,
                    rules: [
                      {
                        required: true,
                        message: '请输入银行卡号',
                      },
                      // {
                      //   validator: this.checkContent.bind(this)
                      // }
                    ],
                  })(
                    <InputNumber placeholder="请输入银行卡号" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="纬度">
                  {getFieldDecorator('latitude', {
                    initialValue: detail.latitude,
                    rules: [
                      {
                        required: true,
                        message: '请输入纬度',
                      },
                    ],
                  })(<Input placeholder="请输入纬度" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="经度">
                  {getFieldDecorator('longitude', {
                    initialValue: detail.longitude,
                    rules: [
                      {
                        required: true,
                        message: '请输入经度',
                      },
                    ],
                  })(<Input placeholder="请输入经度" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkman', {
                    initialValue: detail.linkman,
                    rules: [
                      {
                        required: true,
                        message: '请输入联系人',
                      },
                    ],
                  })(
                    <Input placeholder="请输入联系人" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="联系邮箱">
                  {getFieldDecorator('linkEmail', {
                    initialValue: detail.linkEmail,
                    rules: [
                      {
                        required: true,
                        message: '请输入联系邮箱',
                      },
                    ],
                  })(<Input placeholder="请输入联系邮箱" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('phone', {
                    initialValue: detail.phone,
                    rules: [
                      {
                        required: true,
                        message: '请输入联系电话',
                      },
                    ],
                  })(
                    <Input placeholder="请输入联系电话" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="收银员邮箱">
                  {getFieldDecorator('cashierEmail', {
                    initialValue: detail.cashierEmail,
                    rules: [
                      {
                        required: true,
                        message: '请输入收银员邮箱',
                      },
                    ],
                  })(<Input placeholder="请输入收银员邮箱" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formAllItemLayout} label="统一社会信用代码">
                  {getFieldDecorator('creditCode', {
                    initialValue: detail.creditCode,
                    rules: [
                      {
                        required: true,
                        message: '请输入统一社会信用代码',
                      },
                    ],
                  })(<Input placeholder="请输入统一社会信用代码" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="营业执照">
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => {return false}}
                    onChange={this.handleImg1Change.bind(this, 'businessLicenseUrl')}
                  >
                    {this.state.businessLicenseUrl ? <img src={this.state.businessLicenseUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="开户许可证">
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => {return false}}
                    onChange={this.handleImg1Change.bind(this, 'openBusinessUrl')}
                  >
                    {this.state.openBusinessUrl ? <img src={this.state.openBusinessUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="油站图片">
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => {return false}}
                    onChange={this.handleImg1Change.bind(this, 'logo')}
                  >
                    {this.state.logo ? <img src={this.state.logo} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="油价信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={4} />
              <Col span={4} />
              <Col span={8} align="center">当前价格</Col>
              {/*<Col span={5}></Col>*/}
              <Col span={8} align="center">即将生效价格</Col>
              {/*<Col span={5}></Col>*/}
            </Row>
            <Row gutter={24}>
              <Col span={4} />
              <Col span={4} align="center">油枪号</Col>
              <Col span={4} align="center">国家价</Col>
              <Col span={4} align="center">挂牌价</Col>
              <Col span={4} align="center">国家价</Col>
              <Col span={4} align="center">挂牌价</Col>
            </Row>
            {
              detail.oilList && detail.oilList.map(item => (
                <Row gutter={24}>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label={item.oilNo+'#'}>
                      <Switch checked={Number(item.status)} onChange={this.handleSwitchChange.bind(this, item.oilNo)} />
                    </FormItem>
                  </Col>
                  {
                    item.status ? (
                      <Fragment>
                        <Col span={4}>
                          <Input placeholder="编号之间用英文逗号隔开，例1,2,3" value={item.oilGun} onChange={this.handleAddOilGun.bind(this, item.oilNo)} />
                        </Col>
                        <Col span={4} align="center">{item.currentCountryUnitPrice}</Col>
                        <Col span={4} align="center">{item.currentStationUnitPrice}</Col>
                        <Col span={4} align="center">{item.countryUnitPrice}</Col>
                        <Col span={4} align="center">{item.stationUnitPrice}</Col>
                      </Fragment>
                    ) : ''
                  }

                </Row>
              ))
            }
            <Row gutter={24}>
              <Col span={4} />
              <Col span={4} />
              <Col span={4} align="center">生效时间</Col>
              <Col span={4} align="center">{detail.currentEffectiveTime || '-'}</Col>
              <Col span={4} align="center">生效时间</Col>
              <Col span={4} align="center">{detail.effectiveTime || '-'}</Col>
            </Row>
          </Card>
          <Modal
          title="关闭"
          visible={this.state.visible}
          onOk={this.handleChange}
          onCancel={this.handleCancel}>
            <p>是否上/下线该油号</p>
          </Modal>
        </Form>
      </Panel>
    );
  }
}

export default DeptAdd;
