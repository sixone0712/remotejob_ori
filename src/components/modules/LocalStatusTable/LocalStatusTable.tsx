import { blue } from '@ant-design/colors';
import { DeleteOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Space, Table, Tooltip } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStatus from '../../../hooks/jobStatus/useLocalStatus';
import { PAGE_URL } from '../../../lib/constants';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { convDateformat } from '../../../lib/util/convert';
import { TableColumnPropsType } from '../../../types/common';
import { BuildStatus, LocalColumnName, LocalStatus } from '../../../types/status';
import CustomIcon from '../../atoms/CustomIcon';
import PopupTip from '../../atoms/PopupTip';
import StatusBadge from '../../atoms/StatusBadge';
import StatusTableHeader from '../StatusTableHeader/StatusTableHeader';

export type LocalStatusTableProps = {};

export default function LocalStatusTable({}: LocalStatusTableProps): JSX.Element {
  const { localList, isFetching, refreshRemoteList, openDeleteModal, loggedInUser } = useLocalStatus();
  const localListLen = useMemo(() => (localList?.length ? localList.length : 0), [localList?.length]);
  //const localListLen = localList?.length ? localList.length : 0;
  const history = useHistory();

  const numberRender = useCallback((value: number, record: LocalStatus, index: number) => value + 1, []);
  const buildStatusRender = useCallback((value: BuildStatus, record: LocalStatus, index: number) => {
    const onClick = () =>
      history.push(
        `${PAGE_URL.STATUS_LOCAL_BUILD_HISTORY_CONVERT}/${record.jobId}?name=${record.companyFabName}&date=${record.registeredDate}`
      );

    const errorMsg = record.collectStatus === 'failure' && record.error.length > 0 ? record.error : [];

    return (
      <Space>
        <StatusBadge type={value} onClick={onClick} />
        {errorMsg.length > 0 && (
          <Tooltip
            placement="top"
            title={errorMsg.map((item) => (
              <div key={item}>{item}</div>
            ))}
            color="red"
          >
            <CustomIcon css={errorIconStyle} name="warning" />
            {/* it need to diplay tooltip */}
            <div></div>
          </Tooltip>
        )}
      </Space>
    );
  }, []);

  const deleteRender = useCallback(
    (value: LocalStatus, record: LocalStatus, index: number) => {
      const onClick = () => openDeleteModal(value.jobId);
      return loggedInUser.roles.isRoleJob ? <DeleteOutlined css={iconStyle} onClick={onClick} /> : <div>-</div>;
    },
    [openDeleteModal]
  );

  const titleRender = useCallback(
    () => (
      <StatusTableHeader
        title={{
          name: 'Registered collection list',
          count: localListLen,
        }}
        addBtn={
          loggedInUser.roles.isRoleJob
            ? {
                name: 'Add Job',
                onClick: moveToLocalNewJob,
              }
            : undefined
        }
        refreshBtn={{
          onClick: refreshRemoteList,
        }}
        disabled={isFetching}
        isLoading={isFetching}
      />
    ),
    [localListLen, isFetching]
  );

  const filesRender = useCallback((value: string[], record: LocalStatus, index: number) => {
    return PopupTip({ value: `${value} files`, list: record.fileOriginalNames });
  }, []);

  const dateRender = useCallback((value: string, record: LocalStatus, index: number) => {
    const time = convDateformat(value);
    return <div>{time}</div>;
  }, []);

  const moveToLocalNewJob = useCallback(() => {
    history.push(PAGE_URL.STATUS_LOCAL_ADD);
  }, []);

  return (
    <Table<LocalStatus>
      rowKey={'jobId'}
      dataSource={localList}
      bordered
      title={titleRender}
      size="middle"
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      loading={isFetching}
      css={tableStyle}
    >
      <Table.Column<LocalStatus> {...localColumnProps.index} render={numberRender} />
      <Table.Column<LocalStatus> {...localColumnProps.companyFabName} />
      <Table.Column<LocalStatus> {...localColumnProps.files} render={filesRender} />
      <Table.Column<LocalStatus> {...localColumnProps.collectStatus} render={buildStatusRender} />
      <Table.Column<LocalStatus> {...localColumnProps.registeredDate} render={dateRender} />
      <Table.Column<LocalStatus> {...localColumnProps.delete} render={deleteRender} />
    </Table>
  );
}

const localColumnProps: TableColumnPropsType<LocalStatus, LocalColumnName> = {
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
  companyFabName: {
    key: 'companyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'companyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'companyFabName'),
    },
    shouldCellUpdate: (cur, prev) => cur.companyFabName !== prev.companyFabName,
  },
  collectStatus: {
    key: 'collectStatus',
    title: <TableColumnTitle>Collect/Convert/Insert</TableColumnTitle>,
    dataIndex: 'collectStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'collectStatus'),
    },
    shouldCellUpdate: (cur, prev) =>
      cur.collectStatus !== prev.collectStatus ||
      cur.jobId !== prev.jobId ||
      cur.companyFabName !== prev.companyFabName ||
      cur.registeredDate !== prev.registeredDate,
  },
  files: {
    key: 'files',
    title: <TableColumnTitle>Files</TableColumnTitle>,
    dataIndex: 'files',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'files'),
    },
    shouldCellUpdate: (cur, prev) => cur.files !== prev.files || cur.fileOriginalNames !== prev.fileOriginalNames,
  },
  registeredDate: {
    key: 'registeredDate',
    title: <TableColumnTitle>Date</TableColumnTitle>,
    dataIndex: 'registeredDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'registeredDate'),
    },
    shouldCellUpdate: (cur, prev) => cur.registeredDate !== prev.registeredDate,
  },
  delete: {
    key: 'jobId',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.jobId !== prev.jobId,
  },
};

const tableStyle = css`
  width: 86rem;
`;

const iconStyle = css`
  font-size: 1.25rem;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;
