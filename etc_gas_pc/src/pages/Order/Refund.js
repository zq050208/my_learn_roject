import React, { PureComponent } from 'react';
import {Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Upload, Table, message, Modal} from 'antd';
import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import Panel from '../../components/Panel';
import styles from '../../layouts/Sword.less';
import func from '../../utils/Func';
import { ORDER_REFUND } from '../../actions/order';
import { uploadFile, } from '@/services/api';
import { refunDetailApi, OrderInfoApi } from '../../services/order'
import Debounce from 'lodash-decorators/debounce';
import {requestApi} from "../../services/api";

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/submit'],
}))
@Form.create()
class Refund extends PureComponent {
  state = {
    fileList: [],
    orderDesc: {},
  }
  componentDidMount() {
    OrderInfoApi(this.props.match.params).then(res => {
      this.setState({ orderDesc: res.data })
    })
  }

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { orderSn },
      },
    } = this.props;
  }

  // 提交退款
  handleSubmit = async e => {
    e.preventDefault();
    let _that = this;
    const { dispatch, form, match: { params: { orderSn } } } = _that.props;
    const { fileList } = _that.state;
    const formData = new FormData();
    fileList.length && fileList.forEach(file => {
      formData.append('files', file);
    });
    let images = []
    if (fileList.length) {
      const { data } = await uploadFile(formData)
      images = data.url
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          title: '确认提交',
          content: '是否确认提交?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            delete values.fileList
            dispatch(ORDER_REFUND({ images, orderSn, ...values }));
          },
          onCancel() {},
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      order: {
        detail,
      },
      submitting,
    } = this.props;

    const {
      fileList
    } = this.state

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) return message.error('请上传jpg/png的图片')
        if (this.state.fileList.length > 3) {
          return message.error('上传图片不能超过3张')
        }
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList,
      listType: "picture-card",
    }

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderSn',
      },
      {
        title: '油站名称',
        dataIndex: 'stationName',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
      },
      // {
      //   title: '枪号',
      //   dataIndex: 'oilGun',
      // },
      {
        title: '油号',
        dataIndex: 'oilCode',
      },
      {
        title: '升数（升）',
        dataIndex: 'litre',
      },
      // {
      //   title: '枪价（元）',
      //   dataIndex: 'orgPrice',
      // },
      {
        title: '结算金额',
        dataIndex: 'payAmount',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusStr',
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
      }
    ];


    return (
      <Panel title="申请退款" back="/order/list" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col>
                <Table
                  columns={columns}
                  dataSource={[this.state.orderDesc]}
                  pagination={false} />
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formItemLayout} label="退款原因">
                  {getFieldDecorator('reason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入退款原因',
                      },
                    ],
                  })(<TextArea rows={4} placeholder="请输入退款原因" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formItemLayout} label="上传凭证(不超过3张图片)">
                  {getFieldDecorator('fileList', {
                    rules: [
                      {
                        required: true,
                        message: '最少添加一张图片',
                      },
                    ],
                  })(<Upload {...props}>
                    {fileList.length > 2 ? null : uploadButton}
                  </Upload>)}

                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="收银员">
                  {getFieldDecorator('cashier', {
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(<Input placeholder="请输入收银员" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} className={styles.inputItem} label="油站电话">
                  {getFieldDecorator('stationPhone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入油站电话',
                      },
                    ],
                  })(<InputNumber placeholder="请输入油站电话" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default Refund;
