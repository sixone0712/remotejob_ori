import { ClearOutlined, FundProjectionScreenOutlined, ProfileOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Collapse, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useCallback, useMemo, useState } from 'react';
import { useRemoteCollectConvert } from '../../../hooks/remoteJob/useRemoteCollectConvert';
import { RemoteJobExcuteModeScriptName } from '../../../types/remoteJob';
import { getRemoteJobTitleName, remoteJobCollapseStyle, V_SPACE } from './Common/RemoteJobCommon';
import RemoteJobExcuteMode from './Common/RemoteJobExcuteMode';
import RemoteJobExcuteScript from './Common/RemoteJobExcuteScript';

export type RemoteJobCollectConvertProps = {};

export default function RemoteJobCollectConvert({}: RemoteJobCollectConvertProps): JSX.Element {
  return (
    <div css={style}>
      <ExcuteModeScript name="collect" />
      <V_SPACE />
      <ExcuteModeScript name="convert" />
    </div>
  );
}

const style = css`
  font-size: 1rem;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const ExcuteModeScript = React.memo(function ExcuteModeScriptMemo({ name }: { name: RemoteJobExcuteModeScriptName }) {
  const { enable, onChangeEnable } = useRemoteCollectConvert({
    name,
  });

  const [active, setActive] = useState(enable);

  const Header = useMemo(() => {
    const title = getRemoteJobTitleName(name);
    const icon =
      {
        ['collect']: <ProfileOutlined />,
        ['convert']: <FundProjectionScreenOutlined />,
        ['dbPurge']: <ClearOutlined />,
      }[title] ?? undefined;

    return (
      <div onClick={() => setActive((prev) => !prev)}>
        <Space>
          {icon}
          <div>{title}</div>
        </Space>
      </div>
    );
  }, [name]);

  const setEnable = useCallback(
    (e: CheckboxChangeEvent) => {
      setActive(e.target.checked);
      onChangeEnable(e);
    },
    [onChangeEnable]
  );

  return (
    <div css={excuteModeStyle}>
      <div className="excute-checkbox">
        {name === 'collect' ? <div className="empty" /> : <Checkbox checked={enable} onChange={setEnable} />}
      </div>
      <Collapse
        collapsible={enable ? 'header' : 'disabled'}
        activeKey={active ? name : ''}
        css={remoteJobCollapseStyle(enable)}
      >
        <Collapse.Panel header={Header} key={name}>
          <RemoteJobExcuteMode name={name} />
          <V_SPACE />
          <RemoteJobExcuteScript name={name} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
});

const excuteModeStyle = css`
  display: flex;

  .excute-checkbox {
    display: inherit;
    margin-right: 1rem;
    height: 3rem;
    align-items: center;

    .empty {
      width: 1rem;
      height: 3rem;
    }
  }
  .ant-collapse-item {
    width: 61.375rem;
    .ant-collapse-content-box {
      display: flex;
      flex-direction: column;
    }
  }
`;
