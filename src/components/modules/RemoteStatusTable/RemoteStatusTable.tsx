import { blue } from '@ant-design/colors';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Popconfirm, Space, Table, Tooltip } from 'antd';
import React, { useCallback, useMemo } from 'react';
import useRemoteStatus from '../../../hooks/jobStatus/useRemoteStatus';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { BuildStatus, RemoteColumnName, RemoteJobStatus, StatusStepType } from '../../../types/status';
import CustomIcon from '../../atoms/CustomIcon';
import StatusBadge from '../../atoms/StatusBadge';
import StatusTableHeader from '../StatusTableHeader/StatusTableHeader';
import RemoteStatusSchedule from './Modal/RemoteStatusSchedule';

export type RemoteStatusTableProps = {};

export default function RemoteStatusTable(): JSX.Element {
  const {
    remoteList,
    isFetching,
    refreshRemoteList,
    moveToRemoteNewJob,
    moveToRemoteHistory,
    openStartStopModal,
    openDeleteModal,
    openEditeModal,
    loggedInUser,
    excuteManual,
    openScheduleModal,
  } = useRemoteStatus();
  const remoteListLen = useMemo(() => (remoteList?.length ? remoteList.length : 0), [remoteList?.length]);
  const numberRender = useCallback((value: number, record: RemoteJobStatus, index: number) => value + 1, []);

  const jobNameRender = useCallback(
    (value: string, record: RemoteJobStatus, index: number) => {
      return (
        <div css={record.stop ? disableIconStyle : iconStyle}>
          <div className="sub-item" onClick={() => openScheduleModal(record)}>
            {value}
          </div>
        </div>
      );
    },
    [openScheduleModal]
  );

  const buildStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number, type: StatusStepType, errorMsg: string[]) => {
      return (
        <Space>
          <Popconfirm
            title={remoteStatusName(type)}
            cancelText={`Excute`}
            okText="History"
            cancelButtonProps={{ type: 'primary', disabled: record.stop || !loggedInUser.roles.isRoleJob }}
            onCancel={() => {
              excuteManual(
                {
                  jobId: record.jobId,
                  type,
                },
                record.jobName
              );
            }}
            onConfirm={() => moveToRemoteHistory(record.jobId, record.jobName, type as StatusStepType)}
          >
            <StatusBadge type={value} jobType="remote" />
          </Popconfirm>
          {/* <StatusBadge
            type={value}
            onClick={() => moveToRemoteHistory(record.jobId, record.jobName, type as StatusStepType)}
          /> */}
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
    },
    [moveToRemoteHistory, excuteManual, loggedInUser]
  );

  const collectStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg = record.collectStatus === 'failure' && record.collectError.length > 0 ? record.collectError : [];
      return buildStatusRender(value, record, index, 'collect', errorMsg);
    },
    [buildStatusRender]
  );

  const convertStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg = record.convertStatus === 'failure' && record.convertError.length > 0 ? record.convertError : [];
      return buildStatusRender(value, record, index, 'convert', errorMsg);
    },
    [buildStatusRender]
  );

  const errorSummaryStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg =
        record.errorSummaryStatus === 'failure' && record.errorSummaryError.length > 0 ? record.errorSummaryError : [];
      return buildStatusRender(value, record, index, 'error', errorMsg);
    },
    [buildStatusRender]
  );

  const crasDataStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg =
        record.crasDataStatus === 'failure' && record.crasDataError.length > 0 ? record.crasDataError : [];
      return buildStatusRender(value, record, index, 'cras', errorMsg);
    },
    [buildStatusRender]
  );

  const mpaVersionStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg =
        record.mpaVersionStatus === 'failure' && record.mpaVersionError.length > 0 ? record.mpaVersionError : [];
      return buildStatusRender(value, record, index, 'version', errorMsg);
    },
    [buildStatusRender]
  );

  const dbPurgeStatusRender = useCallback(
    (value: BuildStatus, record: RemoteJobStatus, index: number) => {
      const errorMsg = record.dbPurgeStatus === 'failure' && record.dbPurgeError.length > 0 ? record.dbPurgeError : [];
      return buildStatusRender(value, record, index, 'purge', errorMsg);
    },
    [buildStatusRender]
  );

  const startAndStopRender = useCallback(
    (value: boolean, record: RemoteJobStatus, index: number) => {
      const { jobId, siteId, jobName, stop: prevStop } = record;
      if (value)
        return (
          <div css={statusIconStyle(loggedInUser.roles.isRoleJob)}>
            <CustomIcon className="stopped" name="stop" />
            <span
              className="text"
              onClick={() => openStartStopModal({ action: 'start', jobId, siteId, jobName, prevStop })}
            >
              Stopped
            </span>
          </div>
        );
      else
        return (
          <div
            css={statusIconStyle(loggedInUser.roles.isRoleJob)}
            onClick={() => openStartStopModal({ action: 'stop', jobId, siteId, jobName, prevStop })}
          >
            <CustomIcon className="running" name="play" />
            <span className="text">Running</span>
          </div>
        );
    },
    [openStartStopModal, loggedInUser]
  );

  const editRender = useCallback(
    (value: number, record: RemoteJobStatus, index: number) => {
      const { jobId, siteId, jobName, stop: prevStop } = record;
      return loggedInUser.roles.isRoleJob ? (
        <EditOutlined css={iconStyle} onClick={() => openEditeModal({ jobId, siteId, jobName, prevStop })} />
      ) : (
        <div>-</div>
      );
    },
    [loggedInUser, openEditeModal]
  );

  const deleteRender = useCallback(
    (value: number, record: RemoteJobStatus, index: number) => {
      const { jobId, siteId, jobName, stop: prevStop } = record;
      return loggedInUser.roles.isRoleJob ? (
        <DeleteOutlined css={iconStyle} onClick={() => openDeleteModal({ jobId, siteId, jobName, prevStop })} />
      ) : (
        <div>-</div>
      );
    },
    [openDeleteModal, loggedInUser]
  );

  const titleRender = useCallback(
    () => (
      <StatusTableHeader
        title={{
          name: 'Registered collection list',
          count: remoteListLen,
        }}
        addBtn={
          loggedInUser.roles.isRoleJob
            ? {
                name: 'Add Job',
                onClick: moveToRemoteNewJob,
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
    [remoteListLen, isFetching, loggedInUser, refreshRemoteList, moveToRemoteNewJob]
  );

  return (
    <>
      <Table<RemoteJobStatus>
        rowKey={'jobId'}
        dataSource={remoteList}
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
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.index} width={70} render={numberRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.jobName} width={150} render={jobNameRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.companyFabName} width={175} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.collectStatus} width={120} render={collectStatusRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.convertStatus} width={120} render={convertStatusRender} />
        <Table.Column<RemoteJobStatus>
          {...remoteColumnProps.errorSummaryStatus}
          width={120}
          render={errorSummaryStatusRender}
        />
        <Table.Column<RemoteJobStatus>
          {...remoteColumnProps.crasDataStatus}
          width={120}
          render={crasDataStatusRender}
        />
        <Table.Column<RemoteJobStatus>
          {...remoteColumnProps.mpaVersionStatus}
          width={120}
          render={mpaVersionStatusRender}
        />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.dbPurgeStatus} width={120} render={dbPurgeStatusRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.stop} width={120} render={startAndStopRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.edit} width={60} render={editRender} />
        <Table.Column<RemoteJobStatus> {...remoteColumnProps.delete} width={80} render={deleteRender} />
      </Table>
      <RemoteStatusSchedule />
    </>
  );
}

const tableStyle = css`
  width: 86rem;
`;

const remoteColumnProps: TableColumnPropsType<RemoteJobStatus, RemoteColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    // shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
  jobName: {
    key: 'jobName',
    title: <TableColumnTitle>Job Name</TableColumnTitle>,
    dataIndex: 'jobName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'jobName'),
    },
    // shouldCellUpdate: (cur, prev) => cur.jobName !== prev.jobName,
  },
  companyFabName: {
    key: 'companyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'companyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'companyFabName'),
    },
    // shouldCellUpdate: (cur, prev) => cur.companyFabName !== prev.companyFabName,
  },
  collectStatus: {
    key: 'collectStatus',
    title: <TableColumnTitle>Collect</TableColumnTitle>,
    dataIndex: 'collectStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'collectStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    // cur.collectStatus !== prev.collectStatus || cur.errorSummaryError !== prev.errorSummaryError,
  },
  convertStatus: {
    key: 'convertStatus',
    title: <TableColumnTitle>Convert & Insert</TableColumnTitle>,
    dataIndex: 'convertStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'convertStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.convertStatus !== prev.convertStatus || cur.errorSummaryError !== prev.errorSummaryError,
  },
  errorSummaryStatus: {
    key: 'errorSummaryStatus',
    title: <TableColumnTitle>Error Summary</TableColumnTitle>,
    dataIndex: 'errorSummaryStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'errorSummaryStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.errorSummaryStatus !== prev.errorSummaryStatus || cur.errorSummaryError !== prev.errorSummaryError,
  },
  crasDataStatus: {
    key: 'crasDataStatus',
    title: <TableColumnTitle>Cras Data</TableColumnTitle>,
    dataIndex: 'crasDataStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasDataStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.crasDataStatus !== prev.crasDataStatus || cur.crasDataError !== prev.crasDataError,
  },
  mpaVersionStatus: {
    key: 'mpaVersionStatus',
    title: <TableColumnTitle>Version Check</TableColumnTitle>,
    dataIndex: 'mpaVersionStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'mpaVersionStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.mpaVersionStatus !== prev.mpaVersionStatus || cur.mpaVersionError !== prev.mpaVersionError,
  },
  dbPurgeStatus: {
    key: 'dbPurgeStatus',
    title: <TableColumnTitle>DB Purge</TableColumnTitle>,
    dataIndex: 'dbPurgeStatus',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'dbPurgeStatus'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.mpaVersionStatus !== prev.mpaVersionStatus || cur.mpaVersionError !== prev.mpaVersionError,
  },
  stop: {
    key: 'stop',
    title: <TableColumnTitle>Status</TableColumnTitle>,
    dataIndex: 'stop',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stop'),
    },
    // shouldCellUpdate: (cur, prev) =>
    //   cur.stop !== prev.stop || cur.jobId !== prev.jobId || cur.jobName !== prev.jobName || cur.stop !== prev.stop,
  },
  edit: {
    key: 'edit',
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    dataIndex: 'jobId',
    align: 'center',
    // shouldCellUpdate: (cur, prev) =>
    //   cur.stop !== prev.stop || cur.jobId !== prev.jobId || cur.jobName !== prev.jobName || cur.stop !== prev.stop,
  },
  delete: {
    key: 'delete',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    dataIndex: 'jobId',
    align: 'center',
    // shouldCellUpdate: (cur, prev) =>
    //   cur.stop !== prev.stop || cur.jobId !== prev.jobId || cur.jobName !== prev.jobName || cur.stop !== prev.stop,
  },
};

const iconStyle = css`
  /* font-size: 1.25rem; */
  cursor: pointer;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const disableIconStyle = css`
  cursor: not-allowed;
  .sub-item {
    pointer-events: none;
  }
`;

const statusIconStyle = (isJob: boolean) => css`
  pointer-events: ${!isJob && 'none'};
  .running {
    color: #52c41a;
    -webkit-animation: blink 1s ease-in-out infinite alternate;
    animation: blink 1s ease-in-out infinite alternate;
    @keyframes blink {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  .stopped {
    color: #ff4d4f;
  }
  .text {
    cursor: ${isJob ? 'pointer' : 'default'};
    &:hover {
      color: ${isJob && blue[4]};
    }
    &:active {
      color: ${isJob && blue[6]};
    }
    margin-left: 0.3rem;
  }
`;

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;

export const remoteStatusName = (type: StatusStepType): string =>
  ({
    collect: 'Collect',
    convert: 'Convert & Insert',
    error: 'Error Summary',
    cras: 'Cras Data',
    version: 'Version Check',
    purge: 'DB Purge',
  }[type as string] ?? '');
