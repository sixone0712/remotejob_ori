import { css, SerializedStyles } from '@emotion/react';
import { Input, InputNumber, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { convertDataTypeNumber } from '../../../lib/util/convertRule';
import { RuleColumnData, RuleData, RuleOption } from '../../../types/convertRules';

export const ConvertInput = React.memo(function ConvertInputData({
  value,
  record,
  index,
  onChange,
  keyName,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, value: string) => void;
  keyName: 'name' | 'unit' | 'prefix';
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();
  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);

  useEffect(() => {
    setText(record[keyName] ?? undefined);
  }, [record[keyName]]);

  return (
    <Input
      value={text}
      css={css}
      style={style}
      onChange={(e) => {
        setText(e.target.value);
        debouncedChange(record.index as number, e.target.value);
      }}
    />
  );
});

export const ConvertOutputColumnSelect = React.memo(function ConvertHeaderOutputColumnData({
  value,
  record,
  index,
  onChange,
  onChangeSelect,
  options,
  isNew,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, value: string) => void;
  onChangeSelect: (index: number, value: string) => void;
  options: RuleColumnData[] | undefined;
  isNew: boolean;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);
  useEffect(() => {
    setText(record.output_column ?? undefined);
  }, [record.output_column]);

  return (
    <Space>
      <Input
        value={text}
        css={css}
        style={style}
        onChange={(e) => {
          setText(e.target.value);
          debouncedChange(record.index as number, e.target.value);
        }}
        disabled={!isNew && !record.new && record.output_column_select !== 'custom'}
      />
      {!isNew && (
        <Select
          style={style}
          css={css}
          placeholder="Select a type"
          value={record.output_column_select ?? undefined}
          onSelect={(value) => onChangeSelect(record.index as number, value)}
        >
          {options &&
            options.length > 0 &&
            options.map((item: RuleColumnData) => (
              <Select.Option key={item.column_name} value={item.column_name}>
                {item.column_name}
              </Select.Option>
            ))}
        </Select>
      )}
    </Space>
  );
});

export const ConvertDataType = React.memo(function ConvertDataTypeData({
  value,
  record,
  index,
  onChangeDataType,
  options,
  disabled = false,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChangeDataType: (index: number, value: string) => void;
  options: RuleOption | undefined;
  disabled?: boolean;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  return (
    <Select
      style={style}
      css={css}
      placeholder="Select a type"
      value={record.data_type ?? undefined}
      onSelect={(value) => onChangeDataType(record.index as number, value)}
      disabled={disabled}
    >
      {options?.data_type &&
        options.data_type.length > 0 &&
        options.data_type.map((item: string) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
});

export const ConvertDefaultValue = React.memo(function ConvertDefaultValueData({
  value,
  record,
  index,
  onChangeDefValue,
  onChangeDefType,
  options,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChangeDefValue: (index: number, value: string) => void;
  onChangeDefType: (index: number, value: string) => void;
  options: RuleOption | undefined;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChangeDefValue(index, value);
  }, 300);

  useEffect(() => {
    setText(record.def_val ?? undefined);
  }, [record.def_val]);

  return (
    <Space>
      {record.def_type !== 'lambda' && record.def_type !== 'text' ? (
        <Input style={style} css={css} value={record.def_val ?? undefined} disabled />
      ) : (
        <Input
          style={style}
          css={css}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            debouncedChange(record.index as number, e.target.value);
          }}
        />
      )}
      <Select
        style={style}
        css={css}
        placeholder="Select a value"
        value={record.def_type ?? undefined}
        onSelect={(value) => onChangeDefType(record.index as number, value)}
      >
        {options?.def_type &&
          options.def_type.length > 0 &&
          options.def_type.map((item: string) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
      </Select>
    </Space>
  );
});

export const ConvertInputNumber = React.memo(function ConvertCoefColumnData({
  value,
  record,
  index,
  onChange,
  keyName,
  max,
  min,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, num: number) => void;
  keyName: 'coef' | 're_group' | 'row_index';
  max?: number;
  min?: number;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  let disabled = false;
  if (keyName === 'coef') {
    if (record.data_type) {
      if (!convertDataTypeNumber.includes(record.data_type)) {
        disabled = true;
      }
    } else {
      disabled = true;
    }
  }

  return (
    <InputNumber
      value={record[keyName] ?? undefined}
      max={max}
      min={min}
      style={style}
      css={css}
      onChange={(num: number) => {
        onChange(record.index as number, num);
      }}
      disabled={disabled}
    />
  );
});

export const ConvertRegex = React.memo(function ConvertRegexData({
  value,
  record,
  index,
  onClick,
  styleProps,
  cssProps,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onClick: (index: number) => void;
  styleProps?: React.CSSProperties | undefined;
  cssProps?: SerializedStyles;
}) {
  return (
    <div
      style={styleProps}
      css={css`
        ${cssProps}
        border: 1px solid #d9d9d9;
        height: 1.75rem;
        display: flex;
        justify-items: center;
        align-items: center;
        .textarea {
          padding: 4px 11px 4px 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          border-color: #40a9ff;
        }
        &:active {
          border-right-width: 1px !important;
          outline: 0;
          box-shadow: 0 0 0 2px rgb(24, 144, 255, 20%);
        }
      `}
      onClick={() => {
        onClick(record.index as number);
      }}
    >
      <div className="textarea">{record.regex ?? undefined}</div>
    </div>
  );
});
