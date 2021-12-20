import { RadioChangeEvent } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  remoteExcuteState,
  setRemoteJobCollectReducer,
  setRemoteJobConvertReducer,
  setRemoteJobCrasDataReducer,
  setRemoteJobDbPurgeReducer,
  setRemoteJobErrorSummaryReducer,
  setRemoteJobMpaVersionReducer,
} from '../../reducers/slices/remoteJob';
import { RemoteJobExcuteModeScriptName, RemoteJobExcuteState } from '../../types/remoteJob';

export function useRemoteExcuteMode({ name }: { name: RemoteJobExcuteModeScriptName }) {
  const dispatch = useDispatch();
  const jobExcuteInfo = useSelector(remoteExcuteState(name));

  const setExcuteReducer = useCallback(
    (data: Partial<RemoteJobExcuteState>) => {
      if (name === 'collect') {
        dispatch(setRemoteJobCollectReducer(data));
      } else if (name === 'convert') {
        dispatch(setRemoteJobConvertReducer(data));
      } else if (name === 'errorSummary') {
        dispatch(setRemoteJobErrorSummaryReducer(data));
      } else if (name === 'crasData') {
        dispatch(setRemoteJobCrasDataReducer(data));
      } else if (name === 'mpaVersion') {
        dispatch(setRemoteJobMpaVersionReducer(data));
      } else if (name === 'dbPurge') {
        dispatch(setRemoteJobDbPurgeReducer(data));
      }
    },
    [name, dispatch]
  );

  const onChangeMode = useCallback(
    (e: RadioChangeEvent) => {
      setExcuteReducer({
        time: [],
        mode: e.target.value,
      });
    },
    [setExcuteReducer]
  );

  const onChangePeriod = useCallback(
    (period: number) => {
      setExcuteReducer({
        period,
      });
    },
    [setExcuteReducer]
  );

  const onChangeCycle = useCallback(
    (cycle: 'minute' | 'hour' | 'day') => {
      setExcuteReducer({
        cycle,
      });
    },
    [setExcuteReducer]
  );

  const onChangeTime = useCallback(
    (time: string[]) => {
      setExcuteReducer({
        time,
      });
    },
    [setExcuteReducer]
  );

  return {
    jobExcuteInfo,
    onChangeMode,
    onChangePeriod,
    onChangeCycle,
    onChangeTime,
  };
}
