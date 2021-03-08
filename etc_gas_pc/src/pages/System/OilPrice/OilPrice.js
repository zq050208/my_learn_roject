import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, Card, Table, Pagination } from 'antd';
import Panel from '../../../components/Panel';
import { STATION_LIST, STATION_DETAIL } from '../../../actions/oilPrice';
import { tenantMode } from '../../../defaultSettings';
import SearchBox from '../../../components/Sword/SearchBox';
import styles from '../../../components/Sword/SwordPage.less';
import router from 'umi/router';
import inheritStyles from './OilPrice.less';

const FormItem = Form.Item;

@connect(({ oilPrice, loading }) => ({
  oilPrice,
  loading: loading.models.oilPrice,
}))
@Form.create()
class OilPrice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
      status: '',
    };
  }

  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(STATION_LIST({ stationStatus: 1, current: 1, size: 9 }))
  }

  // ============ 查询 ===============
  handleSubmit = params => {
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const status = form.getFieldValue('stationStatus');
    // this.setState({
    //   status
    // })
    dispatch(STATION_LIST({...params, current, size: 9}));
  };

  // ============ 查询表单 ===============
  renderSearchForm = (onReset, onSubmit) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="油站名称">
            {getFieldDecorator('oilStationName')(<Input placeholder="请输入油站名称" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="上架状态">
            {getFieldDecorator('stationStatus', {
              initialValue: 1
            })(
              <Select defaultValue={1}>
                <Select.Option value={1}>上架中</Select.Option>
                <Select.Option value={0}>已下架</Select.Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={onSubmit}>
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
    // this.refreshTable();
  };

  handleSearch = (firstPage= true, e) => {
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

      this.refreshTable(firstPage);
    });
  };

  refreshTable = (firstPage = false) => {
    const { current, formValues } = this.state;

    const params = {
      current: firstPage ? 1 : current,
      size: 9,
      ...formValues,
    };
    console.log('pa', params)
    this.handleSubmit(params);
  };

  // 添加油价
  handleAddPrice = (station) => {
    console.log('station', station)
    const { dispatch } = this.props;
    sessionStorage.setItem('stationPriceList', JSON.stringify(station.oilPriceList))
    // station.oilPriceList = [...station.oilPriceList, station.oilPriceList[0]]
    // dispatch(STATION_DETAIL(station))
    router.push(`/system/oilPrice/add/${station.stationId}`)
  };

  // 查看详情
  handleCheckDetail = (station) => {
    const { dispatch } = this.props;
    // station.oilPriceList = [...station.oilPriceList, station.oilPriceList[0]]
    // dispatch(STATION_DETAIL(station))
    router.push(`/system/oilPrice/detail/${station.stationId}`)
  }

  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    });
    // this.handleSearch(false)
  };

  render() {
    const code = 'oilPrice';

    const {
      form,
      loading,
      oilPrice: { data },
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

    return (
      <Panel>
        <div className={styles.swordPage}>
          <Card>
            <SearchBox onSubmit={this.handleSearch} onReset={this.handleFormReset}>
              {this.renderSearchForm(this.handleFormReset, this.handleSearch)}
            </SearchBox>
          </Card>
          {
            data.list.data && data.list.data.length ? (
              <Fragment>
                <Row gutter={16} align="top">
                  { data.list.data.map((item, index) => (
                    item.oilStationList.length && item.oilStationList.map((station, stationIndex) => (
                      <Col span={8} style={{ marginTop: 12, height: 290 }}>
                        <Card key={stationIndex} bordered={false} className={inheritStyles.cardBox}>
                          <div className={inheritStyles.cardWrap}>
                            <div className={inheritStyles.cardTitleWrap}>
                              <p className={inheritStyles.title}>{station.stationName}</p>
                              <div style={{ display: 'flex' }}>
                                <Button style={{ marginRight: 10, borderColor: '#19C88C', color: '#19C88C' }} onClick={this.handleAddPrice.bind(this, station)}>添加油价</Button>
                                <Button onClick={this.handleCheckDetail.bind(this, station)}>查看详情</Button>
                              </div>
                            </div>
                            <div>
                              {station.oilPriceList && station.oilPriceList.map(st => (
                                <p>{st.oilNo}: 国家价{st.countryUnitPrice} | 油站价{st.stationUnitPrice} | 优惠价{st.actualUnitPrice}</p>
                              ))}
                            </div>
                          </div>
                          <div className={inheritStyles.cardFooterWrap}>
                            {
                              station.notEffectiveoilPriceList.length ? <p className={inheritStyles.cardFooterActedText}>有新添加即将生效的价格</p> : <p className={inheritStyles.cardFooterText}>无新添加即将生效的价格</p>
                            }
                            {/*<Button shape="round" size="small">{ this.state.status === '1' ? '上架中' : '已下架' }</Button>*/}
                          </div>
                        </Card>
                      </Col>
                    ))
                  ))
                  }
                </Row>
                {/*<Pagination style={{ float: 'right' }} current={this.state.current} onChange={this.onChange} total={data.list.total} />*/}
              </Fragment>

            ) : ''
          }


        </div>

      </Panel>
    );
  }
}
export default OilPrice;
