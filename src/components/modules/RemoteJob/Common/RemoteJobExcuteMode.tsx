import { css } from '@emotion/react';
import { Badge, InputNumber, Radio, Select, Space, TimePicker } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useRemoteExcuteMode } from '../../../../hooks/remoteJob/useRemoteExcuteMode';
import { RemoteJobExcuteModeScriptName } from '../../../../types/remoteJob';
import MarkUpTags from '../../../atoms/MarkupTags';

export type ExcuteModeProps = {
  name: RemoteJobExcuteModeScriptName;
};

export default React.memo(function ExcuteMode({ name }: ExcuteModeProps) {
  const { jobExcuteInfo, onChangeMode, onChangePeriod, onChangeCycle, onChangeTime } = useRemoteExcuteMode({ name });
  const [timeMoment, setTimeMoment] = useState<moment.Moment | null>(null);
  const { cycle, mode, period, time } = jobExcuteInfo;

  const onChangeTimeMoment = useCallback(
    (value: moment.Moment | null, dateString: string) => {
      if (time.findIndex((item) => item === dateString) === -1) {
        onChangeTime([...time, dateString]);
      }
      setTimeMoment(null);
    },
    [time, onChangeTime]
  );

  const ModeValue = useMemo(
    () => (
      <Radio.Group value={mode} onChange={onChangeMode}>
        <Radio value="time">Specified Time</Radio>
        <Radio value="cycle">Cycle</Radio>
      </Radio.Group>
    ),
    [mode, onChangeMode]
  );

  const ModeTimeSetting = useMemo(
    () => (
      <div className="specified-time">
        <Space direction="vertical">
          <TimePicker value={timeMoment} format="HH:mm" onChange={onChangeTimeMoment} />
          <MarkUpTags tags={time} setTags={onChangeTime} />
        </Space>
      </div>
    ),
    [timeMoment, onChangeTimeMoment, time, onChangeTime]
  );

  const ModeCycleSetting = useMemo(
    () => (
      <div className="cycle">
        <InputNumber min={1} max={999} value={period} onChange={onChangePeriod} />
        <Select value={cycle} onChange={onChangeCycle}>
          <Select.Option value="minute">Miniute</Select.Option>
          <Select.Option value="hour">Hour</Select.Option>
          <Select.Option value="day">Day</Select.Option>
        </Select>
      </div>
    ),
    [period, onChangePeriod, cycle, onChangeCycle]
  );

  return (
    <div css={ExcuteModeStyle}>
      <div className="mode-title">
        <Badge color="blue" />
        <span>Excute Mode</span>
      </div>
      <div className="mode-value">
        {ModeValue}
        <div className="mode-value-setting">{mode === 'time' ? ModeTimeSetting : ModeCycleSetting}</div>
      </div>
    </div>
  );
});

const ExcuteModeStyle = css`
  display: flex;
  flex-direction: row;
  .mode-title {
    width: 10rem;
  }
  .mode-value {
    width: 49.375rem;
    .ant-radio-group {
      display: flex;
      .ant-radio-wrapper {
        display: flex;
        align-items: center;
      }
    }
    .mode-value-setting {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      .specified-time {
      }
      .cycle {
        .ant-select {
          margin-left: 1rem;
          width: 6.25rem;
        }
      }
    }
  }
`;
