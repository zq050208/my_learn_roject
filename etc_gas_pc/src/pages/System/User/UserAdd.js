import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import { getGroups } from '../../../utils/authority';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class UserAdd extends PureComponent {
  state = {
    chooseSystem: false
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const password = form.getFieldValue('password');
        const password2 = form.getFieldValue('password2');
        if (password !== password2) {
          message.warning('两次密码输入不一致');
        } else {
          const params = {
            ...values,
            birthday: func.format(values.birthday),
          };
          dispatch(USER_SUBMIT(params));
        }
      }
    });
  };

  handleChange = value => {
    const { dispatch, form } = this.props;
  };

  handleGroupChange = (value) => {
    if (value === 'system') {
      this.props.form.setFieldsValue({nodeId: -1})
      this.setState({
        chooseSystem: true
      })
    } else {
      this.setState({
        chooseSystem: false
      })
    }

  }

  renderTreeNodes = data =>
    data.length && data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.nodeName} value={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    });



  render() {
    const {
      form: { getFieldDecorator },
      user: {
        init: { deptTree, orgTree },
      },
      submitting,
    } = this.props;

    const groups = getGroups();

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
      <Panel title="新增" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="登录账号">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录账号',
                      },
                    ],
                  })(<Input placeholder="请输入登录账号" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属分组">
                  {getFieldDecorator('groupCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属分组',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择所属分组"
                      onChange={this.handleGroupChange}
                    >
                      {groups.map(d => (
                        <Select.Option key={d.groupCode} value={d.groupCode}>
                          {d.groupName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属组织">
                  {getFieldDecorator('nodeId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属组织',
                      },
                    ],
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} 
                      placeholder="请选择所属组织"
                      disabled={this.state.chooseSystem}
                    >
                      {this.renderTreeNodes(orgTree)}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="密码">
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input type="password" placeholder="请输入密码" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="确认密码">
                  {getFieldDecorator('password2', {
                    rules: [
                      {
                        required: true,
                        message: '请输入确认密码',
                      },
                    ],
                  })(<Input type="password" placeholder="请输入确认密码" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户昵称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户昵称',
                      },
                    ],
                  })(<Input placeholder="请输入用户昵称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户姓名">
                  {getFieldDecorator('realName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户姓名',
                      },
                    ],
                  })(<Input placeholder="请输入用户姓名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="手机号码">
                  {getFieldDecorator('phone')(<Input placeholder="请输入手机号码" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('email')(<Input placeholder="请输入电子邮箱" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户性别">
                  {getFieldDecorator('sex')(
                    <Select placeholder="请选择用户性别">
                      <Select.Option key={1} value={1}>
                        男
                      </Select.Option>
                      <Select.Option key={0} value={0}>
                        女
                      </Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户生日">
                  {getFieldDecorator('birthday')(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder="请选择用户生日"
                    />
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

export default UserAdd;
