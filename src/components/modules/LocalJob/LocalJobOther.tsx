import { MailOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Collapse, Space } from 'antd';
import React, { useMemo } from 'react';
import useLocalJobOther from '../../../hooks/localJob/useLocalJobOther';
import { remoteJobCollapseStyle } from '../RemoteJob/Common/RemoteJobCommon';
import LocalJobNoticeEmail from './LocalJobOtherNoticeEmail';

export type LocalJobOtherProps = {};

export default function LocalJobOther({}: LocalJobOtherProps): JSX.Element {
  return (
    <div css={style}>
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

const ErrorNotice = React.memo(function ErrorNoticeMemo() {
  const { enable, setEnable, active, setActive } = useLocalJobOther();

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
          <LocalJobNoticeEmail />
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
