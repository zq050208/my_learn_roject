import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { ROLE_INIT, ROLE_SUBMIT, ROLE_DETAIL, ROLE_CLEAR_DETAIL } from '../../../actions/role';
import { getGroups } from '../../../utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(({ role, loading }) => ({
  role,
  submitting: loading.effects['role/submit'],
}))
@Form.create()
class RoleAdd extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (func.notEmpty(id)) {
      dispatch(ROLE_DETAIL(id));
    } else {
      dispatch(ROLE_CLEAR_DETAIL());
    }
    dispatch(ROLE_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(ROLE_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      role: {
        detail,
        init: { tree },
      },
      submitting,
    } = this.props;

    const groupInfo = getGroups();

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
      <Panel title="新增" back="/system/role" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色名称">
                  {getFieldDecorator('roleName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色名称',
                      },
                    ],
                  })(<Input placeholder="请输入角色名称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色别名">
                  {getFieldDecorator('roleAlias', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色别名',
                      },
                    ],
                  })(<Input placeholder="请输入角色别名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色分组">
                  {getFieldDecorator('groupCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择角色分组'
                      }
                    ]
                  })(
                    <Select placeholder="请输入角色分组">
                      {
                        groupInfo.map(group => (
                          <Option key={ group.groupCode } value={ group.groupCode }>{ group.groupName }</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} className={styles.inputItem} label="角色排序">
                  {getFieldDecorator('sort', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色排序',
                      },
                    ],
                    initialValue: detail.nextSort,
                  })(<InputNumber placeholder="请输入角色排序" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default RoleAdd;
