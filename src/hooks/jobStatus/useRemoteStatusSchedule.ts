import { useCallback, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getRemoteJobTimeLine } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { remoteJobSelectJob, remoteShowTimeLine, setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';
import { RemoteJobTimeLine } from '../../types/remoteJob';

export default function useRemoteStatusSchedule() {
  const dispatch = useDispatch();
  const visible = useSelector(remoteShowTimeLine);
  const scheduleInfo = useSelector(remoteJobSelectJob);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToCenterRef = useRef(false);
  const history = useHistory();

  const { data, isFetching, remove } = useQuery(
    [QUERY_KEY.STATUS_REMOTE_TIME_LINE, scheduleInfo.jobId],
    () => getRemoteJobTimeLine(scheduleInfo.jobId as number),
    {
      enabled: visible && Boolean(scheduleInfo.jobId),
      refetchInterval: 3000,
      onError: () => {
        openNotification('error', 'Error', 'Failed to get Schedule timeline');
      },
    }
  );

  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(
        setRemoteJobInfoReducer({
          showTimeLine: visible,
        })
      );
    },
    [dispatch]
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const moveToHistory = (item: RemoteJobTimeLine) => {
    setVisible(false);
    history.push(
      PAGE_URL.STATUS_REMOTE_BUILD_HISTORY_FROM_SCHEDULE({
        id: scheduleInfo.jobId as number,
        type: item.name,
        jobName: scheduleInfo.jobName as string,
        requestId: item.logId as string,
      })
    );
  };
  return { visible, data, isFetching, remove, handleCancel, scheduleInfo, scrollRef, scrollToCenterRef, moveToHistory };
}
