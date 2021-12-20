import { TransferDirection } from 'antd/lib/transfer';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getRemoteJobJudgeRuleList } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import {
  remoteJobCrasData,
  remoteJobSelectJob,
  remoteJobShowJudgeRule,
  setRemoteJobCrasDataReducer,
  setRemoteJobInfoReducer,
} from '../../reducers/slices/remoteJob';
import { TransferRemoteJobJudgeRule } from '../../types/remoteJob';

export default function useRemoteJobNoticeJudgeRuleEdit() {
  const { siteId } = useSelector(remoteJobSelectJob);
  const { selectJudgeRules } = useSelector(remoteJobCrasData);
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const visible = useSelector(remoteJobShowJudgeRule);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery<TransferRemoteJobJudgeRule[], AxiosError>(
    [QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST, siteId],
    () => getRemoteJobJudgeRuleList(siteId as number),
    {
      enabled: visible && Boolean(siteId),
      onError: (error: AxiosError) => {
        if (visible && Boolean(siteId)) {
          openNotification('error', 'Error', `Failed to response the list of cras data!`, error);
        }
      },
      onSettled: (data) => {
        if (visible && Boolean(siteId)) {
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

  const handleOk = useCallback(() => {
    const selectList: TransferRemoteJobJudgeRule[] = [];
    targetKeys?.map((item) => {
      const foundItem = data?.find((innerItem) => innerItem.key === item) ?? undefined;
      if (foundItem) {
        selectList.push(foundItem);
      }
    });

    dispatch(setRemoteJobCrasDataReducer({ selectJudgeRules: selectList }));
    setVisible(false);
  }, [dispatch, setVisible, data, targetKeys]);

  const handleCancel = useCallback(() => {
    setTargetKeys(targetKeys);
    setVisible(false);
  }, [setVisible, targetKeys]);

  const handleChange = useCallback((targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
  }, []);

  const handleSelectChange = useCallback((sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }, []);

  useEffect(() => {
    if (visible) {
      queryClient.refetchQueries([QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST, siteId], {}, { throwOnError: true });
      const selected = selectJudgeRules?.map((item) => item.key) ?? [];

      setTargetKeys([...selected]);
    } else {
      setTargetKeys([]);
      setSelectedKeys([]);
    }
  }, [visible]);

  return {
    visible,
    data,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  };
}
