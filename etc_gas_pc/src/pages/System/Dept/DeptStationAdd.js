import React, { Fragment, Component } from 'react';
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
  message,
} from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { DEPT_SUBMIT, DEPT_DETAIL, DEPT_CLEAR_DETAIL } from '../../../actions/dept';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {uploadFile} from "@/services/api";
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;
const { TextArea } = Input;




@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class DeptAdd extends Component {
  state = {
    loading: false,
    fileList: [],
    oilList: [
      {
        oilNo: '92',
        status: 1,
      },
      {
        oilNo: '95',
        status: 1
      },
      {
        oilNo: '98',
        status: 1
      },
      {
        oilNo: '0',
        status: 1
      }
    ],
    checkA: false,
    checkB: false,
    checkC: false,
    checkD: false,
    businessLicenseUrl: '',
    openBusinessUrl: '',
    logo: '',
  }

  componentWillMount() {
  }

  @Debounce(500)
  handleSubmit = e => {
    e.preventDefault();
    const { fileList, oilList, logo, businessLicenseUrl, openBusinessUrl } = this.state;
    const { dispatch, form, match: { params: { tenantId } } } = this.props;
    const formData = new FormData();
    fileList.length && fileList.forEach(file => {
      formData.append('files', file);
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let hasOilGun = true
        oilList.map(item => {
          if (item.status && !item.oilGun) {
            message.error('请输入油枪号')
            throw error('请输入油枪号')
          }
        })
        const params = {...values, companyId: tenantId, logo, businessLicenseUrl, openBusinessUrl, oilList}
        dispatch(DEPT_SUBMIT(params));
      }
    });
  };

  handleSwitchChange = (oilCheck, checked) => {
    this.setState(state => {
      const { oilList } = state;
      oilList.map(item => {
        if (item.oilNo === oilCheck) {
          item.status = Number(checked)
        }
      });
      return {
        oilList
      }
    })
    console.log(this.state.oilList)

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

  handleImgChange = (code, info) => {
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

  handleAddOilGun = (oilCheck, e) => {
    let val = e.target.value;
    val = val.replace(/[^\d\,]/g,'');
    this.setState(state => {
      const { oilList } = state;
      oilList.map(item => {
        if (item.oilNo === oilCheck) {
          item.oilGun = val;
        }
      });
      return {
        oilList
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

  render() {
    const {
      form: { getFieldDecorator },
      dept: {
        detail,
        init: { tree },
      },
      submitting,
    } = this.props;

    const { imageUrl, checkA, checkB, checkC, checkD } = this.state;

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
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <Panel title="新增" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="加油站名称">
                  {getFieldDecorator('name', {
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
                    onChange={this.handleImgChange.bind(this, 'businessLicenseUrl')}
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
                    onChange={this.handleImgChange.bind(this, 'openBusinessUrl')}
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
                    onChange={this.handleImgChange.bind(this, 'logo')}
                  >
                    {this.state.logo ? <img src={this.state.logo} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="油号信息" className={styles.card} bordered={false}>
            {
              this.state.oilList.map(item => (
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label={item.oilNo+'#'}>
                      <Switch checked={Boolean(item.status)} onChange={this.handleSwitchChange.bind(this, item.oilNo)} />
                    </FormItem>
                  </Col>
                  {
                    item.status ? (
                      <Col span={12}>
                        <FormItem {...formItemLayout} label="油枪编号">
                          <Input
                            value={item.oilGun}
                            placeholder="编号之间用英文逗号隔开，例1,2,3"
                            style={{ width: '100%' }}
                            onChange={this.handleAddOilGun.bind(this, item.oilNo)} />
                        </FormItem>
                      </Col>
                    ) : ''
                  }

                </Row>
              ))
            }
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptAdd;
