import { MailOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Collapse, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useCallback, useMemo, useState } from 'react';
import { useRemoteNotice } from '../../../hooks/remoteJob/useRemoteNotice';
import { RemoteJobNoticeName } from '../../../types/remoteJob';
import { getRemoteJobTitleName, remoteJobCollapseStyle, V_SPACE } from './Common/RemoteJobCommon';
import RemoteJobExcuteMode from './Common/RemoteJobExcuteMode';
import RemoteJobExcuteScript from './Common/RemoteJobExcuteScript';
import RemoteJobNoticeBefore from './Common/RemoteJobNoticeBefore';
import RemoteJobNoticeCrasData from './Common/RemoteJobNoticeJudegeRule';
import RemoteJobNoticeEmail from './Common/RemoteJobNoticeEmail';

export type RemoteJobNoticeProps = {
  children?: React.ReactNode;
};

export default function RemoteJobNotice({ children }: RemoteJobNoticeProps): JSX.Element {
  return (
    <div css={style}>
      <JobNotice name="errorSummary" />
      <V_SPACE />
      <JobNotice name="crasData" />
      <V_SPACE />
      <JobNotice name="mpaVersion" />
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

const JobNotice = React.memo(function JobNoticeMemo({ name }: { name: RemoteJobNoticeName }) {
  const { enable, onChangeEnable } = useRemoteNotice({
    name,
  });

  const [active, setActive] = useState(enable);

  const Header = useMemo(() => {
    const title = getRemoteJobTitleName(name);
    return (
      <div onClick={() => setActive((prev) => !prev)}>
        <Space>
          <MailOutlined />
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
    <div css={noticeStyle}>
      <div className="excute-checkbox">
        <Checkbox checked={enable} onChange={setEnable} />
      </div>
      <Collapse
        collapsible={enable ? 'header' : 'disabled'}
        activeKey={active ? name : ''}
        css={remoteJobCollapseStyle(enable)}
      >
        <Collapse.Panel header={Header} key={name}>
          <RemoteJobNoticeEmail name={name} />
          <V_SPACE />
          <RemoteJobExcuteMode name={name} />
          <V_SPACE />
          <RemoteJobNoticeBefore name={name} />
          <V_SPACE />
          {name === 'crasData' && (
            <>
              <RemoteJobNoticeCrasData />
              <V_SPACE />
            </>
          )}
          <RemoteJobExcuteScript name={name} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
});

const noticeStyle = css`
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
