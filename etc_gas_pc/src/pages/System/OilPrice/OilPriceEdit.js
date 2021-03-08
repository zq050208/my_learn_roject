import React, { PureComponent } from 'react';
import { Form, Row } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import OilPriceHOC from './oilPriceHOC';

@connect(({ oilPrice, loading }) => ({
  oilPrice,
  submitting: loading.effects['oilPrice/submit'],
}))
@Form.create()
class OilPriceEdit extends PureComponent {
  render() {
    return (
      <Panel title="修改" back={true} action={this.props.action}>
        <Row gutter={24}>
          {
            this.props.children
          }
        </Row>
      </Panel>
    );
  }
}

export default OilPriceHOC('edit')(OilPriceEdit);
