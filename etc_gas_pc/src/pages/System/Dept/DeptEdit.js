import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, message, Upload, Switch } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { TENANT_DETAIL, TENANT_SUBMIT, TENANT_CLEAR_DETAIL, TENANT_UPDATE } from '../../../actions/tenant';
import func from '@/utils/Func';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/api';
import Debounce from 'lodash-decorators/debounce';
import { detail as reqTenantDetail } from '../../../services/tenant';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ tenant, loading }) => ({
  tenant,
  submitting: loading.effects['tenant/submit'],
}))
@Form.create()
class DeptEdit extends PureComponent {
  state = {
    loading: false,
    fileList: [],
    uploading: true,
    picUrl: '',
    tenantDetail: {},
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    reqTenantDetail({ nodeId: id })
      .then(res => {
        console.log(res)
        this.setState({
          tenantDetail: res.data,
          picUrl: res.data.picUrl
        })

      })
  }

  @Debounce(500)
  handleSubmit = async e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          nodeId: id,
          picUrl: this.state.picUrl,
          ...values,
        };
        dispatch(TENANT_UPDATE(params));
      }
    });
  };

  handleUpload = (file) => {
    const formData = new FormData();
    formData.append('files', file);
    uploadFile(formData).then(res => {
      this.setState({ address: res.data })
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleImgChange = (info) => {
    console.log(info)
    if(info.file) {
      const formData = new FormData();
      formData.append('files', info.file);
      uploadFile(formData).then(res => {
        console.log('图片返回成功', res)
        this.setState({
          picUrl: res.data.url[0]
        })
      })
    }
  }


  render() {
    const {
      form: { getFieldDecorator },
      tenant: {
        detail,
      },
      submitting,
    } = this.props;

    const { picUrl, tenantDetail } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="修改" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>

          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="统一社会信用代码">
                  {getFieldDecorator('creditCode', {
                    initialValue: tenantDetail.creditCode,
                  })(<Input placeholder="请输入统一社会信用代码" />)}
                </FormItem>
              </Col>
            </Row>


            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="商户名称">
                  {getFieldDecorator('companyName', {
                    initialValue: tenantDetail.companyName,
                    rules: [
                      {
                        required: true,
                        message: '请输入商户名称',
                      },
                    ],
                  })(<Input placeholder="请输入商户名称" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkman', {
                    initialValue: tenantDetail.linkman,
                    rules: [
                      {
                        required: true,
                        message: '请输入联系人',
                      },
                    ],
                  })(<Input placeholder="请输入联系人" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="联系邮箱">
                  {getFieldDecorator('email', {
                    initialValue: tenantDetail.email,
                  })(<Input placeholder="请输入联系邮箱" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('phone', {
                    initialValue: tenantDetail.phone,
                    rules: [
                      {
                        required: true,
                        message: '请输入联系电话',
                      },
                    ],
                  })(<Input placeholder="请输入联系电话" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formItemLayout} label="旗下加油站数">
                  {getFieldDecorator('stationCount', {
                    initialValue: tenantDetail.stationCount,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formItemLayout} label="营业资质">
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => {return false}}
                    onChange={this.handleImgChange}
                  >
                    {picUrl ? <img src={picUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptEdit;
