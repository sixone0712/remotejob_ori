import { blue } from '@ant-design/colors';
import { DeleteOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Form, Popconfirm, Table } from 'antd';
import React, { useCallback, useMemo, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useConvertCsvHeader from '../../../hooks/useConvertCsvHeader';
import { TableColumnPropsType } from '../../../types/common';
import { RuleData } from '../../../types/convertRules';
import TableHeader from '../TableHeader';
import {
  ConvertDataType,
  ConvertDefaultValue,
  ConvertInput,
  ConvertInputNumber,
  ConvertOutputColumnSelect,
} from './ConvertDefineTableItem';
import {
  ConvertTableCoefTooltip,
  ConvertTableDataTypeTooltip,
  ConvertTableNameTooltip,
  ConvertTableTitle,
} from './ConvertTitleItem';

const type = 'DraggableBodyRow';

export type ConvertDefineTableCsvHeaderProps = {};

function ConvertDefineTableCsvHeader({}: ConvertDefineTableCsvHeaderProps): JSX.Element {
  const {
    headerTable,
    options,
    columnOptions,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onChangeCoef,
    onChangeUnit,
    onDelete,
    onAdd,
    moveRow,
    isNewRule,
    fetchingRuleBase,
  } = useConvertCsvHeader();

  const titleRender = useCallback(
    () => (
      <TableHeader
        title=""
        button1={{
          name: 'Add',
          icon: <PlusOutlined />,
          onClick: onAdd,
        }}
      />
    ),
    [onAdd]
  );
  const indexRender = useCallback((value: number, record: RuleData, index: number) => {
    return <div>{value + 1}</div>;
  }, []);

  const nameRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertInput
        keyName="name"
        record={record}
        onChange={onChangeName}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeName]
  );

  const outputColumnRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertOutputColumnSelect
        record={record}
        onChange={onChangeOutputColumn}
        onChangeSelect={onChangeOutputColumnSelect}
        options={columnOptions}
        isNew={isNewRule}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeOutputColumn, onChangeOutputColumnSelect, isNewRule, columnOptions]
  );

  const dataTypeRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertDataType
        record={record}
        options={options}
        onChangeDataType={onChangeDataType}
        disabled={!isNewRule && record.output_column_select !== 'custom'}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [options, onChangeDataType, isNewRule]
  );

  const defaultValueRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertDefaultValue
        record={record}
        options={options}
        onChangeDefValue={onChangeDefaultValue}
        onChangeDefType={onChangeDefaultType}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),

    [options, onChangeDefaultValue, onChangeDefaultType]
  );

  const coefRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return (
        <ConvertInputNumber
          keyName="coef"
          record={record}
          onChange={onChangeCoef}
          style={{
            width: 170,
            fontSize: '0.75rem',
          }}
        />
      );
    },
    [onChangeCoef]
  );

  const unitRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertInput
        keyName="unit"
        record={record}
        onChange={onChangeUnit}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeUnit]
  );

  const deleteRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return (
        <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete(value)}>
          <DeleteOutlined css={iconStyle} />
        </Popconfirm>
      );
    },
    [onDelete]
  );

  const components = useMemo(
    () => ({
      body: {
        row: DraggableBodyRow,
      },
    }),
    [DraggableBodyRow]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Form>
        <Form.Item
          label="Headers : "
          required
          tooltip="At least one row must be registered."
          css={css`
            margin-top: 1rem;
            margin-bottom: 0;
          `}
        />
      </Form>
      <Table<RuleData>
        dataSource={headerTable}
        size="small"
        bordered
        // tableLayout="fixed"
        pagination={false}
        title={titleRender}
        components={components}
        onRow={(record, index): any => ({
          index,
          moveRow,
        })}
        css={tableStyle}
        scroll={{ x: true }}
        rowKey="index"
        loading={fetchingRuleBase}
      >
        <Table.Column<RuleData> {...headerColumnProps.sort} render={() => <MenuOutlined />} />
        <Table.Column<RuleData> {...headerColumnProps.index} render={indexRender} />
        <Table.Column<RuleData> {...headerColumnProps.column} />
        <Table.Column<RuleData> {...headerColumnProps.data} />
        <Table.Column<RuleData> {...headerColumnProps.name} render={nameRender} />
        <Table.Column<RuleData> {...headerColumnProps.output_column} render={outputColumnRender} />
        <Table.Column<RuleData> {...headerColumnProps.data_type} render={dataTypeRender} />
        <Table.Column<RuleData> {...headerColumnProps.def_val} render={defaultValueRender} />
        <Table.Column<RuleData> {...headerColumnProps.coef} render={coefRender} />
        <Table.Column<RuleData> {...headerColumnProps.unit} render={unitRender} />
        <Table.Column<RuleData> {...headerColumnProps.delete} render={deleteRender} />
      </Table>
    </DndProvider>
  );
}

export default React.memo(ConvertDefineTableCsvHeader);

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem<any>() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

type HeaderColumnName =
  | 'sort'
  | 'index'
  | 'column'
  | 'data'
  | 'name'
  | 'output_column'
  | 'data_type'
  | 'def_val'
  | 'coef'
  | 'unit'
  | 'delete';

const headerColumnProps: TableColumnPropsType<RuleData, HeaderColumnName> = {
  sort: {
    key: 'sort',
    title: 'Sort',
    dataIndex: 'index',
    align: 'center',
    shouldCellUpdate: (cur, prev) => false,
  },
  index: {
    key: 'index',
    title: 'Index',
    dataIndex: 'index',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },

  column: {
    key: 'index',
    title: 'Column',
    dataIndex: 'column',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.column !== prev.column,
  },
  data: {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.data !== prev.data,
  },
  name: {
    key: 'name',
    title: <ConvertTableTitle title={'Name'} tooltip={ConvertTableNameTooltip} />,
    dataIndex: 'name',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.name !== prev.name || cur.index !== prev.index,
  },
  output_column: {
    key: 'output_column',
    title: 'Output Column',
    dataIndex: 'output_column',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.output_column !== prev.output_column ||
      cur.output_column_select !== prev.output_column_select ||
      cur.index !== prev.index,
  },
  data_type: {
    key: 'data_type',
    title: <ConvertTableTitle title="Data Type" tooltip={ConvertTableDataTypeTooltip} />,
    dataIndex: 'data_type',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.data_type !== prev.data_type ||
      cur.output_column_select !== prev.output_column_select ||
      cur.index !== prev.index,
  },
  def_val: {
    key: 'def_val',
    title: 'Default Value',
    dataIndex: 'def_val',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.def_val !== prev.def_val || cur.def_type !== prev.def_type || cur.index !== prev.index,
  },
  coef: {
    key: 'coef',
    title: <ConvertTableTitle title="Coefficient" tooltip={ConvertTableCoefTooltip} />,
    dataIndex: 'coef',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.coef !== prev.coef || cur.data_type !== prev.data_type || cur.index !== prev.index,
  },
  unit: {
    key: 'unit',
    title: 'Unit',
    dataIndex: 'unit',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.unit !== prev.unit || cur.index !== prev.index,
  },
  delete: {
    key: 'delete',
    title: 'Delete',
    dataIndex: 'index',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
};

const tableStyle = css`
  tr.drop-over-downward td:nth-of-type(n + 5) {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td:nth-of-type(n + 5) {
    border-top: 2px dashed #1890ff;
  }
`;

const iconStyle = css`
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;
