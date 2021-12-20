import { ClearOutlined, MailOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Collapse, Space } from 'antd';
import React, { useMemo } from 'react';
import useRemoteJobOtherDbPurge from '../../../hooks/remoteJob/useRemoteJobOtherDbPurge';
import useRemoteJobOtherErrorNotice from '../../../hooks/remoteJob/useRemoteJobOtherErrorNotice';
import { getRemoteJobTitleName, remoteJobCollapseStyle, V_SPACE } from './Common/RemoteJobCommon';
import RemoteJobExcuteMode from './Common/RemoteJobExcuteMode';
import RemoteJobExcuteScript from './Common/RemoteJobExcuteScript';
import RemoteJobNoticeEmail from './Common/RemoteJobNoticeEmail';

export type RemoteJobOtherProps = {};

export default function RemoteJobOther({}: RemoteJobOtherProps): JSX.Element {
  return (
    <div css={style}>
      <DBPurge />
      <V_SPACE />
      <ErrorNotice />
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

const DBPurge = React.memo(function DBPurgeMemo() {
  const { enable, setEnable, active, setActive } = useRemoteJobOtherDbPurge();

  const Header = useMemo(
    () => (
      <div onClick={() => setActive((prev) => !prev)}>
        <Space>
          <ClearOutlined />
          <div>{getRemoteJobTitleName('dbPurge')}</div>
        </Space>
      </div>
    ),
    [setActive]
  );

  return (
    <div css={dbPurgeStyle}>
      <div className="excute-checkbox">
        <Checkbox checked={enable} onChange={setEnable} />
      </div>
      <Collapse
        collapsible={enable ? 'header' : 'disabled'}
        activeKey={active ? 'dbPurge' : ''}
        css={remoteJobCollapseStyle(enable)}
      >
        <Collapse.Panel header={Header} key={'dbPurge'}>
          <RemoteJobExcuteMode name="dbPurge" />
          <V_SPACE />
          <RemoteJobExcuteScript name="dbPurge" />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
});

const dbPurgeStyle = css`
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

const ErrorNotice = React.memo(function ErrorNoticeMemo() {
  const { enable, setEnable, active, setActive } = useRemoteJobOtherErrorNotice();

  const Header = useMemo(
    () => (
      <div onClick={() => setActive((prev) => !prev)}>
        <Space>
          <MailOutlined />
          <div>Error Notice</div>
        </Space>
      </div>
    ),
    [setActive]
  );
  return (
    <div css={errorNoticeStyle}>
      <div className="excute-checkbox">
        <Checkbox checked={enable} onChange={setEnable} />
      </div>
      <Collapse
        collapsible={enable ? 'header' : 'disabled'}
        activeKey={active ? 'errorNotice' : ''}
        css={remoteJobCollapseStyle(enable)}
      >
        <Collapse.Panel header={Header} key={'errorNotice'}>
          <RemoteJobNoticeEmail name="errorNotice" />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
});

const errorNoticeStyle = css`
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
