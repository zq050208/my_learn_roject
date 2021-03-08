import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, Card, message } from 'antd';
import Panel from '../../../components/Panel';
import { STATION_LIST, HISTORY_REMOVE, STATION_DETAIL } from '../../../actions/oilPrice';
import { tenantMode } from '../../../defaultSettings';
import router from 'umi/router';
import styles from './OilPriceDetail.less';

const FormItem = Form.Item;
const oilNoList = ['92#', '95#', '98#', '0#'];

@connect(({ oilPrice, loading }) => ({
  oilPrice,
  loading: loading.models.oilPrice,
}))
@Form.create()
class OilPriceDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
    };
  }

  componentWillMount() {
    const { dispatch, match: { params: {stationId} } } = this.props;
    dispatch(STATION_DETAIL({stationId}))
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(STATION_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="油站名称">
            {getFieldDecorator('oilName')(<Input placeholder="请输入油站名称" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="上架状态">
            {getFieldDecorator('fullName')(<Select />)}
          </FormItem>
        </Col>
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
  };

  checkHistory = () => {
    const {
      match: { params: {stationId} },
      oilPrice: { detail }
    } = this.props;
    router.push(`/system/oilPrice/OilPriceHistory/${stationId}`)
  }

  handleFormReset = async () => {
    const { form, onReset } = this.props;
    form.resetFields();
    await this.setState({
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
    });
    if (onReset) {
      onReset();
    }
    this.refreshTable();
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { form } = this.props;

    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
      };

      await this.setState({
        formValues: values,
      });

      this.refreshTable(true);
    });
  };

  refreshTable = (firstPage = false) => {
    const { onSearch } = this.props;
    const { current, size, formValues } = this.state;

    const params = {
      current: firstPage ? 1 : current,
      size,
      ...formValues,
    };
    if (onSearch) {
      onSearch(params);
    }
  };

  // 添加油价
  handleAddPrice = (oilName) => {
    router.push(`/system/oilPrice/add/${oilName}`)
  };

  handleDelete = () => {
    const {
      oilPrice: { detail },
      dispatch,
    } = this.props;
    dispatch(HISTORY_REMOVE({
      data: { stationId: detail.stationId },
      success: () => {
        message.success('删除成功');
        router.push('/system/oilPrice')
      }
    }))

  }

  handleUpdate = () => {
    const {
      oilPrice: { detail },
    } = this.props;
    sessionStorage.setItem('stationPriceList', JSON.stringify(detail.notEffectiveoilPriceList))
    router.push(`/system/oilPrice/edit/${detail.stationId}`)
  }

  render() {
    const code = 'oilPrice';

    const {
      form,
      loading,
      oilPrice: { detail },
    } = this.props;

    const columns = [
      {
        title: '公司名称',
        dataIndex: 'deptName',
      },
      {
        title: '油站名称',
        dataIndex: 'oilName',
      },
      {
        title: '油号',
        dataIndex: 'oilNo',
      },
      {
        title: '国家价',
        dataIndex: 'countryPrice',
      },
      {
        title: '油站挂牌价',
        dataIndex: 'stationPrice',
      },
      {
        title: '优惠价',
        dataIndex: 'discountPrice',
      },
      {
        title: '对应枪号',
        dataIndex: 'gunNo',
      },
    ];


    if (!tenantMode) {
      columns.splice(0, 1);
    }

    const CardWrapper = (props) => {
      const { title, code, dataSource } = props;
      if (!dataSource || dataSource.length === 0) return null
      return (
        <Card className={styles.cardWrap} style={{ marginBottom: '16px' }}>
          <div className={styles.cardTitleWrap}>
            <div className={styles.title}>{title}</div>
            <div>
              {
                code === 'acted' && <Button onClick={this.checkHistory}>历史价格</Button>
              }
              {
                code === 'acting' && (
                  <Fragment>
                    <Button style={{ marginRight: 8 }} onClick={this.handleUpdate}>修改</Button>
                    <Button onClick={this.handleDelete}>删除</Button>
                  </Fragment>
                )
              }
            </div>
          </div>
          <Row gutter={24}>
            {
              dataSource.length && dataSource.map((oil, index) => (
                <Col span={6}>
                  <Card className={styles.innerCardWrap}>
                    <p className={styles.emTitle}>{ oil.oilName }</p>
                    <p className={styles.countryPrice}>国家价：￥{oil.countryUnitPrice}</p>
                    <p className={styles.stationPrice}>油站价：￥{oil.stationUnitPrice}</p>
                    <p className={styles.discountPrice}>优惠价：￥{oil.actualUnitPrice}</p>
                  
                    {
                      oil.entryInfoForceTime && (
                        <div className={ code === 'acted' ? styles.actedTime : styles.actingTime }>{String(oil.entryInfoForceTime)}</div>
                      )
                    }
                    
                  </Card>
                </Col>
              ))
            }
          </Row>
        </Card>

      )
    }

    return (
      <Panel>
        <Button onClick={() => (history.back())} style={{ marginBottom: 10 }}>返回</Button>
        <div>
          {
            (detail && detail.oilPriceList && detail.oilPriceList.length) ? (
              <CardWrapper title="当前生效价格" code="acted" dataSource={detail.oilPriceList} />
            ) : ''
          }
          {
            (detail && detail.notEffectiveoilPriceList && detail.notEffectiveoilPriceList.length) ? (
              <CardWrapper title="即将生效价格" code="acting" dataSource={detail.notEffectiveoilPriceList} />
            ) : ''
          }
        </div>

      </Panel>
    );
  }
}
export default OilPriceDetail;
