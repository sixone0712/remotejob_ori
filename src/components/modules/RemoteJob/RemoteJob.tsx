import { AppstoreOutlined, FileSyncOutlined, NotificationOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { PageHeader, Space } from 'antd';
import React from 'react';
import { useRemoteJob } from '../../../hooks/remoteJob/useRemoteJob';
import { remoteJobStepList, REMOTE_JOB_STEP } from '../../../types/remoteJob';
import CustomIcon from '../../atoms/CustomIcon';
import SideSteps from '../../atoms/SideSteps';
import StepButton from '../../atoms/StepButton';
import RemoteJobCollectConvert from './RemoteJobCollectConvert';
import RemoteJobConfirm from './RemoteJobConfirm';
import RemoteJobNotice from './RemoteJobNotice';
import RemoteJobOther from './RemoteJobOther';
import RemoteJobPlan from './RemoteJobPlan';

export type RemoteJobProps = {
  type: 'add' | 'edit';
};

export default function RemoteJob({ type }: RemoteJobProps): JSX.Element {
  const { current, setCurrent, onBack, onNextAction, disabledNext } = useRemoteJob({ type });

  return (
    <div css={style}>
      <PageHeader onBack={onBack} title={`${type === 'add' ? 'Add' : 'Edit'} Remote Job Setting`} />
      <div className="layout">
        <div className="sider">
          <SideSteps current={current} stepList={remoteJobStepList} />
        </div>
        <div className="content">
          <div className="prev-next">
            <RemoteTitle current={current} />
            <StepButton
              current={current}
              setCurrent={setCurrent}
              lastStep={REMOTE_JOB_STEP.CONFIRM}
              nextActionPromise={onNextAction}
              type={type}
              disabled={disabledNext}
            />
          </div>
          <div className="setting">
            {current === REMOTE_JOB_STEP.PLANS && <RemoteJobPlan type={type} />}
            {current === REMOTE_JOB_STEP.COLLECT_CONVERT && <RemoteJobCollectConvert />}
            {current === REMOTE_JOB_STEP.NOTICE && <RemoteJobNotice />}
            {current === REMOTE_JOB_STEP.OTHER_SETTING && <RemoteJobOther />}
            {current === REMOTE_JOB_STEP.CONFIRM && <RemoteJobConfirm />}
          </div>
        </div>
      </div>
    </div>
  );
}

const RemoteTitle = React.memo(function RemoteTitleMemo({ current }: { current: number }) {
  return (
    {
      [REMOTE_JOB_STEP.PLANS]: (
        <Space>
          <CustomIcon name="plans_setting" />
          <span>Plans Setting</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.COLLECT_CONVERT]: (
        <Space>
          <FileSyncOutlined />
          <span>Collect & Convert</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.NOTICE]: (
        <Space>
          <NotificationOutlined />
          <span>Notice Settings</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.OTHER_SETTING]: (
        <Space>
          <AppstoreOutlined />
          <span>Other Setting</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.CONFIRM]: (
        <Space>
          <CustomIcon name="check_setting" />
          <span>Check Settings</span>
        </Space>
      ),
    }[current] ?? <></>
  );
});

const style = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: inherit;

  .layout {
    display: flex;
    width: 87rem;
    padding-left: 1.75rem;
    padding-right: 1.75rem;
    margin-top: 1.875rem;
    flex-wrap: nowrap;

    .content {
      display: inherit;
      flex-direction: column;
      width: 66.6875rem;

      .prev-next {
        display: inherit;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 1rem;
        font-size: 1.125rem;
      }

      .setting {
        padding-top: 2.125rem;
        margin-left: 3rem;
      }
    }
  }
`;
