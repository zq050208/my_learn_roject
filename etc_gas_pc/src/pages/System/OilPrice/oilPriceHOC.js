import React, { PureComponent, useState, useEffect } from 'react';
import { Form, Input, Card, Row, Col, Button, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../../layouts/Sword.less';
import { OIL_PRICE_SUBMIT, OIL_PRICE_UPDATE } from '../../../actions/oilPrice';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const TIPS = ['', '例如：8折输入0.8', '请输入减掉金额', '请输入最终优惠价'];

const createForm = (props) => {
  const {
    form,
    dataSource,
  } = props;

  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const [way, setWay] = useState(0);
  const [tips, setTips] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (way) setTips(TIPS[way]);
    else setTips(TIPS[0]);
  }, [way])

  function handleCalPrice() {
    let actualUnitPrice
    const stationUnitPrice = form.getFieldValue(`stationUnitPrice`);
    if (stationUnitPrice && way && price) {
      switch (way) {
        case '1':
          actualUnitPrice = parseFloat(stationUnitPrice * price).toFixed(2)
          break
        case '2':
          actualUnitPrice = parseFloat(stationUnitPrice - price).toFixed(2)
          break
        case '3':
          actualUnitPrice = parseFloat(price).toFixed(2)
          break
      }
      form.setFieldsValue({ actualUnitPrice })
    } else {
      message.error('请先填挂牌价和优惠价格')
    }

  }

  return (
    <Form style={{ marginTop: 8 }}>
      <Col span={12}>
        <Card className={styles.card} title={dataSource.oilNo} bordered={false}>
          <FormItem {...formItemLayout} label="国家价">
            {getFieldDecorator(`countryUnitPrice`, {
              rules: [
                {
                  required: true,
                  message: '请输入国家价',
                },
              ],
              initialValue: dataSource.countryUnitPrice || ''
            })(<Input placeholder="请输入国家价" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="油站挂牌价">
            {getFieldDecorator(`stationUnitPrice`, {
              rules: [
                {
                  required: true,
                  message: '请输入油站挂牌价',
                },
              ],
              initialValue: dataSource.stationUnitPrice || ''
            })(<Input placeholder="请输入油站挂牌价" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠方式">
            <Row gutter={8}>
              <Col span={8}>
                <Select onChange={value => setWay(value)}>
                  <Select.Option value="1">折扣</Select.Option>
                  <Select.Option value="2">立减</Select.Option>
                  <Select.Option value="3">定价</Select.Option>
                </Select>
              </Col>
              <Col span={10}>
                <Input placeholder={tips} onChange={e => setPrice(e.target.value)} />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={handleCalPrice}>确定</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="生成优惠价">
            {getFieldDecorator(`actualUnitPrice`, {
              rules: [
                {
                  required: true,
                  message: '请生成优惠价',
                },
              ],
              initialValue: dataSource.actualUnitPrice || ''
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="生效时间">
            {getFieldDecorator(`entryInfoForceTime`, {
              rules: [
                {
                  required: true,
                  message: '请输入生效时间',
                },
              ],
              initialValue: dataSource.entryInfoForceTime ? moment(dataSource.entryInfoForceTime, dateFormat) : ''
            })(<DatePicker showTime />)}
          </FormItem>
        </Card>
      </Col>
    </Form>
  )
}
const AddOilPriceForm = Form.create()(createForm)

const OilPriceHOC = (key) => (WrappedComponent) => Form.create()(
  @connect(({ oilPrice, loading }) => ({
    oilPrice,
    submitting: loading.effects['oilPrice/submit'],
  }))
  class OilPriceCom extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        oilNoList: []
      };
    }

    componentWillMount() {
      const stationPriceList = JSON.parse(sessionStorage.getItem('stationPriceList'));
      if (stationPriceList.length) {
        const oilNoList =  key === 'add' ? stationPriceList.map(v => ({ oilNo: v.oilNo, oilName: v.oilName })) : stationPriceList
        console.log('sfs', oilNoList)
        this.setState({
          oilNoList
        })
      }
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const { dispatch, match: { params: {stationId} } } = this.props;
      const { oilNoList } = this.state;
      const canSubmit = [];
      const oilPriceList = [];
      oilNoList.map((item, index) => {
        this[`formRef${index}`].validateFields((err, values) => {
          if (!err) {
            console.log(values)
            const formValue = {
              ...item,
              ...values,
              entryInfoForceTime: moment(values.entryInfoForceTime).format(dateFormat),
              stationId
            }
            oilPriceList.push(formValue)
            canSubmit.push(true)
          }
        })
      })
      if (canSubmit.includes(true)) {
        console.log(oilPriceList)
        if (key === 'add') {
          dispatch(OIL_PRICE_SUBMIT({oilPriceList}));
        } else if (key === 'edit') {
          dispatch(OIL_PRICE_UPDATE({oilPriceList}));
        }
      }
    };

    render() {
      const {
        oilNoList
      } = this.state;

      const {
        submitting
      } = this.props;

      const action = (
        <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
          提交
        </Button>
      );

      const props = {
        action
      }

      if (oilNoList.length) {
        return (
          <WrappedComponent {...props}>
            {
              oilNoList.map((item, index) => (
                <AddOilPriceForm
                  ref={(form) => this[`formRef${index}`] = form}
                  dataSource={item}
                />
              ))
            }
          </WrappedComponent>
        )
      }
      return null
    }
  }
);

export default OilPriceHOC;
