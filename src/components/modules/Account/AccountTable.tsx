import { blue } from '@ant-design/colors';
import { DeleteOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Table } from 'antd';
import { CompareFn } from 'antd/lib/table/interface';
import { AlignType, DataIndex } from 'rc-table/lib/interface';
import React, { Key, useCallback } from 'react';
import useAccountTable from '../../../hooks/useAccountTable';
import { UserInfo } from '../../../lib/api/axios/types';
import { USER_ROLE_NAME } from '../../../lib/constants';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { UserRolesBoolean } from '../../../reducers/slices/loginUser';
import { TableColumnPropsType } from '../../../types/common';
import StatusTableHeader from '../StatusTableHeader';
import AccountAddUser from './AccountAddUser';
import AccountEditPermission from './AccountEditPermission';

export type AccountTableProps = {};

export default function AccountTable({}: AccountTableProps): JSX.Element {
  const {
    users,
    usersLen,
    isFetchingUsers,
    refreshUsers,
    visiblePermission,
    setVisiblePermission,
    visibleAddUser,
    setVisibleAddUser,
    id,
    setId,
    rules,
    setRules,
    openDeleteModal,
  } = useAccountTable();

  const numberRender = useCallback((value: number, record: UserInfo, index: number) => value + 1, []);

  const permissionRender = useCallback(
    (value: UserRolesBoolean, record: UserInfo, index: number) => {
      const onClick = () => {
        setVisiblePermission(true);
        setRules(value);
        setId(record.id);
      };

      return (
        <div css={permissionStyle} onClick={onClick}>
          <div className={'enable'}>{USER_ROLE_NAME.STATUS}</div>
          <div className={'divider'}>{'|'}</div>
          <div className={value.isRoleJob ? 'enable' : 'disable'}>{USER_ROLE_NAME.JOB}</div>
          <div className={'divider'}>{'|'}</div>
          <div className={value.isRoleConfigure ? 'enable' : 'disable'}>{USER_ROLE_NAME.CONFIGURE}</div>
          <div className={'divider'}>{'|'}</div>
          <div className={value.isRoleRules ? 'enable' : 'disable'}>{USER_ROLE_NAME.RULES}</div>
          <div className={'divider'}>{'|'}</div>
          <div className={value.isRoleAddress ? 'enable' : 'disable'}>{USER_ROLE_NAME.ADDRESS}</div>
          <div className={'divider'}>{'|'}</div>
          <div className={value.isRoleAccount ? 'enable' : 'disable'}>{USER_ROLE_NAME.ACCOUNT}</div>
        </div>
      );
    },
    [setVisiblePermission, setRules, setId]
  );

  const deleteRender = useCallback((value: number, record: UserInfo, index: number) => {
    return (
      <DeleteOutlined
        css={iconStyle}
        onClick={() => {
          openDeleteModal(value, record.username);
        }}
      />
    );
  }, []);

  const titleRender = useCallback(
    () => (
      <StatusTableHeader
        title={{
          name: 'Registered User list',
          count: usersLen,
        }}
        addBtn={{
          name: 'Add User',
          onClick: () => {
            setVisibleAddUser(true);
          },
        }}
        refreshBtn={{
          onClick: refreshUsers,
        }}
        disabled={isFetchingUsers}
        isLoading={isFetchingUsers}
      />
    ),
    [usersLen, isFetchingUsers]
  );

  return (
    <>
      <Table<UserInfo>
        rowKey={'id'}
        dataSource={users}
        bordered
        title={titleRender}
        size="middle"
        pagination={{
          position: ['bottomCenter'],
          total: usersLen,
          showSizeChanger: true,
        }}
        loading={isFetchingUsers}
        css={tableStyle}
      >
        <Table.Column<UserInfo> {...accountColumnProps.index} render={numberRender} />
        <Table.Column<UserInfo> {...accountColumnProps.username} />
        <Table.Column<UserInfo> {...accountColumnProps.roles} render={permissionRender} />
        <Table.Column<UserInfo> {...accountColumnProps.accessAt} />
        <Table.Column<UserInfo> {...accountColumnProps.updateAt} />
        <Table.Column<UserInfo> {...accountColumnProps.delete} render={deleteRender} />
      </Table>
      <AccountEditPermission
        visible={visiblePermission}
        setVisible={setVisiblePermission}
        id={id}
        rules={rules}
        onRefresh={refreshUsers}
      />
      <AccountAddUser visible={visibleAddUser} setVisible={setVisibleAddUser} />
    </>
  );
}

const tableStyle = css`
  width: 86rem;
`;

const permissionStyle = css`
  display: flex;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${blue[1]};
    border-radius: 0.3rem;
  }

  &:active {
    background-color: ${blue[3]};
    border-radius: 0.3rem;
  }

  .disable {
    color: darkgray;
  }

  .enable {
    color: black;
    font-weight: 700;
  }

  .divider {
    margin-left: 10px;
    margin-right: 10px;
    color: black;
  }
`;

const iconStyle = css`
  /* font-size: 1.25rem; */
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

export type AccountColumnName = 'index' | 'username' | 'roles' | 'accessAt' | 'updateAt' | 'delete';

const accountColumnProps: TableColumnPropsType<UserInfo, AccountColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
  username: {
    key: 'username',
    title: <TableColumnTitle>User Name</TableColumnTitle>,
    dataIndex: 'username',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'username'),
    },
    shouldCellUpdate: (cur, prev) => cur.username !== prev.username,
  },
  roles: {
    key: 'roles',
    title: <TableColumnTitle>Permission</TableColumnTitle>,
    dataIndex: 'roles',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.roles !== prev.roles || cur.id !== prev.id,
  },
  accessAt: {
    key: 'accessAt',
    title: <TableColumnTitle>Last Accessed</TableColumnTitle>,
    dataIndex: 'accessAt',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'accessAt'),
    },
    shouldCellUpdate: (cur, prev) => cur.accessAt !== prev.accessAt,
  },
  updateAt: {
    key: 'updateAt',
    title: <TableColumnTitle>Last Updated</TableColumnTitle>,
    dataIndex: 'updateAt',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'updateAt'),
    },
    shouldCellUpdate: (cur, prev) => cur.updateAt !== prev.updateAt,
  },
  delete: {
    key: 'delete',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    dataIndex: 'id',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index || cur.username !== prev.username,
  },
};
