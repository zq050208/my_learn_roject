import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Upload, Table, message, Modal } from 'antd';
import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import Panel from '../../components/Panel';
import styles from '../../layouts/Sword.less';
import func from '../../utils/Func';
import { ORDER_REFUND } from '../../actions/order';
import { uploadFile, } from '@/services/api';
import { refunDetailApi, OrderInfoApi, orderrefundApi } from '../../services/order'
import Debounce from 'lodash-decorators/debounce';
import { router } from 'umi';

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
    returnDesc: {},
    previewVisible: false
  }
  componentDidMount() {
    OrderInfoApi(this.props.match.params).then(res => {
      this.setState({ orderDesc: res.data })
    })
    refunDetailApi(this.props.match.params).then(res => {
      this.setState({ returnDesc: res.data })
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
  @Debounce(500)
  handleSubmit = async e => {
    e.preventDefault();
    let _that = this
    Modal.confirm({
      title: '确认提交',
      content: '是否确认退款?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        const { match: { params: { orderSn } } } = _that.props;
        orderrefundApi({orderSn}).then(res => {
          if (res.code === 200) {
            message.success(res.msg)
            router.goBack()
          }
        })
      },
      onCancel() {},
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
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
        console.log('file', file)
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
        审核
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

    const { previewVisible, previewImage, previewTitle } = this.state;
    const fileListImg = this.state.returnDesc.images ?
      this.state.returnDesc.images.map((item, index) => ({ url: item, name: '1.png', status: 'done', uid: index })) :
      []
    return (
      <Panel title="审核退款" back="/order/list" action={action}>
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
                  {this.state.returnDesc.reason}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formItemLayout} label="上传凭证">
                  {/* {
                    this.state.returnDesc.images ? this.state.returnDesc.images.map(src => <img src={src} key={src} alt="图片" />) : null
                  } */}

                  <div className="clearfix">
                    <Upload
                      listType="picture-card"
                      fileList={fileListImg}
                      onPreview={this.handlePreview}
                    >
                    </Upload>
                    <Modal
                      visible={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={this.handleCancel}
                    >
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="收银员">
                  {this.state.returnDesc.cashier}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} className={styles.inputItem} label="油站电话">
                  {this.state.returnDesc.stationPhone}
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
