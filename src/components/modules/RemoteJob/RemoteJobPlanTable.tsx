import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Checkbox, Table, Tooltip } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback } from 'react';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { RemoteJobState, REMOTE_PLAN_DETAIL } from '../../../types/remoteJob';
import { RemotePlan } from '../../../types/status';
import PopupTip from '../../atoms/PopupTip';
import StatusTableHeader from '../StatusTableHeader/StatusTableHeader';

export type RemoteJobPlanTableProps = {
  plans: RemotePlan[] | undefined;
  selectPlanIds: RemoteJobState['planIds'];
  setSelectPlanIds: (value: React.Key[]) => void;
  isFetchingPlans: boolean;
  refreshPlans: () => void;
  selectSiteInfo: LabeledValue;
};

export default React.memo(function RemoteJobPlanTable({
  plans,
  selectPlanIds,
  setSelectPlanIds,
  isFetchingPlans,
  refreshPlans,
  selectSiteInfo,
}: RemoteJobPlanTableProps): JSX.Element {
  const planTypeRender = useCallback((value: string, record: RemotePlan, index: number, type?: AutoPlansColumnName) => {
    return <div>{getPlanType(value)}</div>;
  }, []);

  const statusRender = useCallback((value: string, record: RemotePlan, index: number, type?: AutoPlansColumnName) => {
    return <Badge status={value === 'stop' ? 'error' : 'processing'} text={value === 'stop' ? 'Stopped' : 'Running'} />;
  }, []);

  const detailRender = useCallback(
    (value: REMOTE_PLAN_DETAIL, record: RemotePlan, index: number, type?: AutoPlansColumnName) => {
      const text = value?.charAt(0).toUpperCase() + value?.slice(1) ?? 'Unknown';
      return (
        <>
          {record.error ? (
            <Tooltip color="red" title={<ErrorDetailPopup error={record.error} measure={record.measure} />}>
              <Badge color={getErrorDetailColor(value)} text={text} />
            </Tooltip>
          ) : (
            <Badge color={getErrorDetailColor(value)} text={text} />
          )}
        </>
      );
    },
    []
  );

  const mahcinesRender = useCallback(
    (value: number, record: RemotePlan, index: number, type?: AutoPlansColumnName) =>
      PopupTip({ value, list: record.machineNames }),
    []
  );

  const targetsRender = useCallback(
    (value: number, record: RemotePlan, index: number, type?: AutoPlansColumnName) =>
      PopupTip({ value, list: record.targetNames }),
    []
  );

  const titleRender = useCallback(
    () => (
      <StatusTableHeader
        title={{
          name: 'Registered collection list',
          count: plans ? plans.length : 0,
        }}
        refreshBtn={{
          onClick: refreshPlans,
        }}
        isLoading={isFetchingPlans}
        disabled={!selectSiteInfo?.value}
      />
    ),
    [plans, isFetchingPlans, selectSiteInfo, refreshPlans]
  );

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: RemotePlan[]) => {
    setSelectPlanIds(selectedRowKeys);
  };

  const toggleSelectAll = useCallback(() => {
    if (plans && plans.length > 0)
      setSelectPlanIds(selectPlanIds.length === plans.length ? [] : plans.map((r: RemotePlan) => r.planId));
  }, [plans, selectPlanIds, setSelectPlanIds]);

  const allCheckbox = () => (
    <Checkbox
      checked={selectPlanIds && selectPlanIds.length ? true : false}
      indeterminate={plans && selectPlanIds && selectPlanIds.length > 0 && selectPlanIds.length < plans.length}
      onChange={toggleSelectAll}
    />
  );

  const rowSelection: TableRowSelection<RemotePlan> = {
    type: 'checkbox',
    selectedRowKeys: selectPlanIds,
    onChange: onSelectChange,
    columnTitle: allCheckbox,
  };

  const onRow = (record: RemotePlan, rowIndex: number | undefined) => ({
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (record.planId !== undefined) {
        if (selectPlanIds.find((item) => item === record.planId) !== undefined) {
          setSelectPlanIds(selectPlanIds.filter((item) => item !== record.planId));
        } else {
          setSelectPlanIds(selectPlanIds.concat(record.planId));
        }
      }
    },
  });

  return (
    <Table<RemotePlan>
      rowKey={'planId'}
      rowSelection={rowSelection}
      dataSource={plans}
      bordered
      title={titleRender}
      size="middle"
      pagination={{
        position: ['bottomCenter'],
        total: plans?.length,
      }}
      loading={isFetchingPlans}
      onRow={onRow}
      tableLayout="fixed"
    >
      <Table.Column<RemotePlan> {...autoPlansColumnProps.planName} width={200} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.description} width={204} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.planType} width={140} render={planTypeRender} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.machineCount} width={100} render={mahcinesRender} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.targetCount} width={100} render={targetsRender} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.status} width={120} render={statusRender} />
      <Table.Column<RemotePlan> {...autoPlansColumnProps.detail} width={120} render={detailRender} />
    </Table>
  );
});

const ColumnTitle = styled.div`
  font-weight: 700;
`;
export type AutoPlansColumnName =
  | 'planName'
  | 'description'
  | 'planType'
  | 'machineCount'
  | 'targetCount'
  | 'status'
  | 'detail';

const autoPlansColumnProps: TableColumnPropsType<RemotePlan, AutoPlansColumnName> = {
  planName: {
    key: 'planName',
    title: <ColumnTitle>Plan Name</ColumnTitle>,
    dataIndex: 'planName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'planName'),
    },
  },
  description: {
    key: 'description',
    title: <ColumnTitle>Description</ColumnTitle>,
    dataIndex: 'description',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'description'),
    },
  },
  planType: {
    key: 'plan_type',
    title: <ColumnTitle>Type</ColumnTitle>,
    dataIndex: 'planType',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'planType'),
    },
  },
  machineCount: {
    key: 'machines',
    title: <ColumnTitle>Machines</ColumnTitle>,
    dataIndex: 'machineCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'machineCount'),
    },
  },
  targetCount: {
    key: 'targets',
    title: <ColumnTitle>Targets</ColumnTitle>,
    dataIndex: 'targetCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'targetCount'),
    },
  },
  status: {
    key: 'status',
    title: <ColumnTitle>Status</ColumnTitle>,
    dataIndex: 'status',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'status'),
    },
  },
  detail: {
    key: 'detail',
    title: <ColumnTitle>Detail</ColumnTitle>,
    dataIndex: 'detail',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'detail'),
    },
  },
};

const ErrorDetailPopup = React.memo(function ErrorDetailPopupMemo({
  error,
  measure,
}: {
  error: string;
  measure: string;
}) {
  return (
    <div>
      <div>• Error</div>
      <p
        css={css`
          white-space: pre-line;
        `}
      >
        {error}
      </p>
      <p />
      <div>• Detail</div>
      <p
        css={css`
          white-space: pre-line;
        `}
      >
        {measure}
      </p>
    </div>
  );
});

const getErrorDetailColor = (value: REMOTE_PLAN_DETAIL): string =>
  ({
    [REMOTE_PLAN_DETAIL.REGISTERED]: '#d9d9d9',
    [REMOTE_PLAN_DETAIL.COLLECTING]: 'blue',
    [REMOTE_PLAN_DETAIL.COLLECTED]: 'green',
    [REMOTE_PLAN_DETAIL.SUSPENDED]: 'red',
    [REMOTE_PLAN_DETAIL.HALTED]: 'red',
    [REMOTE_PLAN_DETAIL.COMPLETED]: '#d9d9d9',
  }[value] ?? '#d9d9d9');

const getPlanType = (value: string): string =>
  ({
    ftp: 'FTP',
    vftp_comapt: 'VFTP(COMPAT)',
    vftp_sss: 'VFP(SSS)',
  }[value] ?? '-');
