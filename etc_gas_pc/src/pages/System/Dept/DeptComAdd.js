import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Upload } from 'antd';
import { connect } from 'dva';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { TENANT_INIT, TENANT_SUBMIT, TENANT_DETAIL, TENANT_CLEAR_DETAIL } from '../../../actions/tenant';
import { uploadFile } from '../../../services/api';
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class DeptComAdd extends PureComponent {
  state = {
    loading: false,
    picUrl: '',
    fileList: [],
    uploading: true,
  }

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // if (func.notEmpty(id)) {
    //   dispatch(TENANT_DETAIL(id));
    // } else {
    //   dispatch(TENANT_CLEAR_DETAIL());
    // }
    // dispatch(TENANT_INIT());
  }

  @Debounce(500)
  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { picUrl } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {...values, picUrl};
        dispatch(TENANT_SUBMIT(params));
      }
    });
  };

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
      dept: {
        detail,
        init: { tree },
      },
      submitting,
    } = this.props;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { picUrl } = this.state;

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
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );


    return (
      <Panel title="新增" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="统一社会信用代码">
                  {getFieldDecorator('creditCode', {
                  })(<Input placeholder="统一社会信用代码" />)}
                </FormItem>
              </Col>
            </Row>


            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="商户名称">
                  {getFieldDecorator('companyName', {
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
                  })(<Input placeholder="请输入联系邮箱" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('phone', {
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
              <Col span={12}>
                <FormItem {...formItemLayout} label="营业执照">
                  {getFieldDecorator('picUrl', {})(
                    <Upload
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={() => {return false}}
                      onChange={this.handleImgChange}
                    >
                      {picUrl ? <img src={picUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptComAdd;
