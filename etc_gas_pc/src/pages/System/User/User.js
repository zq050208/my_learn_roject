import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, message, Modal, Row, Tree, Select } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { USER_INIT, USER_LIST, USER_ROLE_GRANT, USER_ROLE } from '../../../actions/user';
import { resetPassword } from '../../../services/user';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const Option = Select.Option;
const groupName = {
  'company': '公司组',
  'gasstation': '油站组',
  'system': '系统组',
  'merchan': '商户组'
}

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class User extends PureComponent {
  state = {
    visible: false,
    confirmLoading: false,
    selectedRows: [],
    checkedTreeKeys: [],
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    return selectedRows.map(row => row.id);
  };

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(USER_LIST(params));
  };

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, keys } = payload;
    const { dispatch } = this.props;
    if (btn.code === 'user_role') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      if (keys.length > 1) {
        message.warn('请选择不多于一条数据!');
        return;
      }
      dispatch(USER_ROLE(keys[0], (res) => {
        this.setState(state => {
          return {
            ...state,
            checkedTreeKeys: res
          }
        })
      }))
      this.showModal();
      return;
    }
    if (btn.code === 'user_reset') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      Modal.confirm({
        title: '重置密码确认',
        content: '确定将选择账号密码重置为123456?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const response = await resetPassword({ userIds: keys });
          if (response.success) {
            message.success(response.msg);
          } else {
            message.error(response.msg || '重置失败');
          }
        },
        onCancel() {},
      });
    }
  };

  handleGrant = () => {
    const { checkedTreeKeys } = this.state;
    const keys = this.getSelectKeys();

    this.setState({
      confirmLoading: true,
    });

    const { dispatch } = this.props;
    dispatch(
      USER_ROLE_GRANT({ userIds: keys, roleIds: checkedTreeKeys.checked || checkedTreeKeys }, () => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        message.success('配置成功');
        this.setState({
          checkedTreeKeys: [],
        });
        dispatch(USER_LIST());
      })
    );
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () =>
    this.setState({
      visible: false,
    });

  onCheck = checkedTreeKeys => {
    this.setState({ checkedTreeKeys })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.roleName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.roleName} key={item.id} dataRef={item} />;
    });

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="账号">
            {getFieldDecorator('account')(<Input placeholder="请输入账号" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="姓名">
            {getFieldDecorator('realName')(<Input placeholder="请输入姓名" />)}
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

  render() {
    const code = 'user';

    const { visible, confirmLoading, checkedTreeKeys } = this.state;

    const {
      form,
      loading,
      user: {
        data,
        init: { roleTree },
      },
    } = this.props;
    console.log('roleTree', roleTree)

    const columns = [
      {
        title: '登录账号',
        dataIndex: 'account',
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
      },
      {
        title: '用户姓名',
        dataIndex: 'realName',
      },
      {
        title: '所属角色',
        dataIndex: 'roleName',
      },
      {
        title: '所属分组',
        dataIndex: 'groupCode',
        render: (res) => {
          return groupName[res]
        }
      },
      {
        title: '所属部门',
        dataIndex: 'nodeName',
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
    ];

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel>
        <Grid
          rowKey="id"
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
        <Modal
          title="权限配置"
          width={350}
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={this.handleGrant}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tree checkable checkStrictly checkedKeys={checkedTreeKeys} onCheck={this.onCheck}>
            {this.renderTreeNodes(roleTree)}
          </Tree>
        </Modal>
      </Panel>
    );
  }
}
export default User;
