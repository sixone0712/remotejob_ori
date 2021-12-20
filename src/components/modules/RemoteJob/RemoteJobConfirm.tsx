import { css } from '@emotion/react';
import { Badge } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { remoteJobInfo } from '../../../reducers/slices/remoteJob';
import { RemoteJobExcuteState, RemoteNotificationState } from '../../../types/remoteJob';
import PopupTip from '../../atoms/PopupTip';
import { getRemoteJobTitleName, V_SPACE } from './Common/RemoteJobCommon';
export type RemoteJobConfirmProps = {};

export default function RemoteJobConfirm({}: RemoteJobConfirmProps): JSX.Element {
  const remoteJob = useSelector(remoteJobInfo);

  return (
    <div css={style}>
      <div className="job-name">
        <div className="name">
          <Badge color="blue" />
          <span>Job Name</span>
        </div>
        <div className="value">{remoteJob.jobName}</div>
      </div>
      <div className="user-fab-name">
        <div className="name">
          <Badge color="blue" />
          <span>User-Fab Name</span>
        </div>
        <div className="value">{remoteJob.siteName}</div>
      </div>
      <div className="select-plans">
        <div className="name">
          <Badge color="blue" />
          <span>Select Plans</span>
        </div>
        <div className="value">{remoteJob.planIds.length} Plans</div>
      </div>
      <div className="collect">
        <div className="name">
          <Badge color="blue" />
          <span>{getRemoteJobTitleName('collect')}</span>
        </div>
        <div className="value">
          <ConfirmExcute state={remoteJob.collect} />
        </div>
      </div>
      <div className="convert">
        <div className="name">
          <Badge color="blue" />
          <span>{getRemoteJobTitleName('convert')}</span>
        </div>
        <div className="value">
          {remoteJob.isConvert ? <ConfirmExcute state={remoteJob.convert} /> : <div>None</div>}
        </div>
      </div>
      <div className="notice">
        <div className="name">
          <Badge color="blue" />
          <span>Notice</span>
        </div>
        <div className="value">
          <div className="sub-item">
            <div className="sub-item-name">{getRemoteJobTitleName('errorSummary')}</div>
            <div className="sub-item-value">
              {remoteJob.isErrorSummary ? (
                <>
                  <ConfirmExcute state={remoteJob.errorSummary} />
                  <ConfirmNotice state={remoteJob.errorSummary} />
                </>
              ) : (
                <div>None</div>
              )}
            </div>
          </div>
          <V_SPACE />
          <div className="sub-item">
            <div className="sub-item-name">{getRemoteJobTitleName('crasData')}</div>
            <div className="sub-item-value">
              {remoteJob.isCrasData ? (
                <>
                  <ConfirmExcute state={remoteJob.crasData} />
                  <ConfirmNotice state={remoteJob.crasData} />
                  <ConfirmJudgeRule state={remoteJob.crasData} />
                </>
              ) : (
                <div>None</div>
              )}
            </div>
          </div>
          <V_SPACE />
          <div className="sub-item">
            <div className="sub-item-name">{getRemoteJobTitleName('mpaVersion')}</div>
            <div className="sub-item-value">
              {remoteJob.isMpaVersion ? (
                <>
                  <ConfirmExcute state={remoteJob.mpaVersion} />
                  <ConfirmNotice state={remoteJob.mpaVersion} />
                </>
              ) : (
                <div>None</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="other-work">
        <div className="name">
          <Badge color="blue" />
          <span>Other Setting</span>
        </div>
        <div className="value">
          <div className="sub-item">
            <div className="sub-item-name">{getRemoteJobTitleName('dbPurge')}</div>
            <div className="sub-item-value">
              {remoteJob.isDbPurge ? <ConfirmExcute state={remoteJob.dbPurge} /> : <div>None</div>}
            </div>
          </div>
          <V_SPACE />
          <div className="sub-item">
            <div className="sub-item-name">{getRemoteJobTitleName('errorNotice')}</div>
            <div className="sub-item-value">
              {remoteJob.isErrorNotice ? <ConfirmNotice state={remoteJob.errorNotice} /> : <div>None</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmExcute({ state }: { state: RemoteJobExcuteState }) {
  return (
    <div className="excute-value" css={confirmItemStyle}>
      <div className="excute-mode">
        {state.mode === 'time' ? (
          <div>{`Specified Time / ${state.time.join(', ')}`}</div>
        ) : (
          <div>{`Cycle / ${state.period} ${state.cycle}`}</div>
        )}
      </div>
      <div className="excute-script">
        {state.script.previous && <div>Previous Script Registed </div>}
        {state.script.next && <div>Next Script Registed </div>}
      </div>
    </div>
  );
}

const confirmItemStyle = css`
  display: flex;
  flex-direction: column;
  width: inherit;
`;

function ConfirmNotice({ state }: { state: RemoteNotificationState }) {
  return (
    <div className="notice-value" css={confirmItemStyle}>
      {state.recipient.length > 0 ? (
        <div>
          <PopupTip
            value={`${state.recipient.length} Recipients`}
            list={state.recipient.map((item) => item.label as string)}
            placement="right"
            color="blue"
          />
        </div>
      ) : (
        <div className="recipients">{`${state.recipient.length} Recipients`}</div>
      )}
      <div className="before">{`Before ${state.before} Day `}</div>
    </div>
  );
}

function ConfirmJudgeRule({ state }: { state: RemoteNotificationState }) {
  return (
    <div className="judge-value" css={confirmItemStyle}>
      <div className="judge-rules">
        {`${state.selectJudgeRules?.length ?? 0} / ${state.totalJudgeRules} Judge Rules`}
      </div>
    </div>
  );
}

const style = css`
  font-size: 1rem;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  .job-name,
  .user-fab-name,
  .select-plans,
  .convert,
  .collect,
  .notice,
  .other-work {
    display: flex;
    .name {
      width: 14rem;
    }
    .value {
      display: flex;
      flex-direction: column;
      width: 49.125rem;
      .sub-item {
        display: flex;
        width: 49.125rem;
        .sub-item-name {
          width: 12rem;
        }
        .sub-item-value {
          width: 37.125rem;
        }
      }
    }
    margin-bottom: 1rem;
  }
`;
