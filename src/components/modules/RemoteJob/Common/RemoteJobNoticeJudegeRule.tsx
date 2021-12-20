import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button, Space } from 'antd';
import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getRemoteJobJudgeRuleList } from '../../../../lib/api/axios/requests';
import { QUERY_KEY } from '../../../../lib/api/query/queryKey';
import { openNotification } from '../../../../lib/util/notification';
import {
  remoteJobCrasData,
  remoteJobSelectJob,
  remoteJobShowJudgeRule,
  setRemoteJobCrasDataReducer,
  setRemoteJobInfoReducer,
} from '../../../../reducers/slices/remoteJob';
import { TransferRemoteJobJudgeRule } from '../../../../types/remoteJob';
import RemoteJobNoticeJudgeRuleEdit from '../Modal/RemoteJobNoticeJudgeRuleEdit';

export type RemoteJobNoticeJudgeRuleProps = {};

export default React.memo(function RemoteJobNoticeJudgeRule({}: RemoteJobNoticeJudgeRuleProps): JSX.Element {
  const { selectJudgeRules, totalJudgeRules } = useSelector(remoteJobCrasData);
  const { siteId } = useSelector(remoteJobSelectJob);
  const dispatch = useDispatch();
  const visible = useSelector(remoteJobShowJudgeRule);

  const { isFetching } = useQuery<TransferRemoteJobJudgeRule[], AxiosError>(
    [QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST, siteId],
    () => getRemoteJobJudgeRuleList(siteId as number),
    {
      enabled: Boolean(siteId),
      onError: (error: AxiosError) => {
        if (!visible) {
          openNotification('error', 'Error', `Failed to response the list of cras data!`, error);
        }
      },
      onSettled: (data) => {
        if (!visible) {
          dispatch(setRemoteJobCrasDataReducer({ totalJudgeRules: data?.length ?? 0 }));
        }
      },
    }
  );

  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(setRemoteJobInfoReducer({ showJudgeRule: visible }));
    },
    [dispatch]
  );

  return (
    <div css={style}>
      <div className="judge-rule">
        <div className="judge-rule-title">
          <Badge color="blue" />
          <span>Select Judge Rules</span>
        </div>
        <div className="judge-rule-value">
          <Space>
            <div className="rules">{`${selectJudgeRules?.length ?? 0} / ${totalJudgeRules} Rules`}</div>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setVisible(true)}
              disabled={isFetching}
              loading={isFetching}
            >
              Edit
            </Button>
          </Space>
        </div>
      </div>
      <RemoteJobNoticeJudgeRuleEdit />
    </div>
  );
});

const style = css`
  display: flex;
  flex-direction: row;

  .judge-rule {
    display: flex;
    align-items: center;
    .judge-rule-title {
      width: 10rem;
    }
    .judge-rule-value {
      display: flex;
      align-items: center;
      .rules {
        min-width: 7rem;
      }
      .ant-btn {
        border-radius: 0.625rem;
      }
    }
  }
`;
