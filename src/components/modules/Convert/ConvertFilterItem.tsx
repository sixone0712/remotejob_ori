import { SerializedStyles } from '@emotion/react';
import { Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { RuleFilterData, RuleOption } from '../../../types/convertRules';

export const ConvertFilterName = React.memo(function ConvertFilterNameData({
  value,
  record,
  index,
  onChange,
  style,
  css,
}: {
  value?: string | null;
  record: RuleFilterData;
  index?: number;
  onChange: (index: number, value: string) => void;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);

  useEffect(() => {
    setText(record.name ?? undefined);
  }, [record.name]);

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

export const ConvertFilterType = React.memo(function ConvertFilterTypeData({
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
  record: RuleFilterData;
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
      value={record.type ?? undefined}
      onSelect={(value) => onChangeDataType(record.index as number, value)}
      disabled={disabled}
    >
      {options?.filter_type &&
        options.filter_type.length > 0 &&
        options.filter_type.map((item: string) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
});

export const ConvertFilterCondition = React.memo(function ConvertFilterConditionData({
  value,
  record,
  index,
  onChange,
  style,
  css,
}: {
  value?: string | null;
  record: RuleFilterData;
  index?: number;
  onChange: (index: number, value: string) => void;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);

  useEffect(() => {
    setText(record.condition ?? undefined);
  }, [record.condition]);

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
