import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { remoteStatusName } from '../../components/modules/RemoteStatusTable/RemoteStatusTable';
import {
  deleteRemoteJob,
  excuteManualRemoteJob,
  getRemoteJobStatus,
  getRemoteJobStopStatus,
  startRemoteJob,
  stopRemoteJob,
} from '../../lib/api/axios/requests';
import { MUTATION_KEY } from '../../lib/api/query/mutationKey';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { LoginUserSelector } from '../../reducers/slices/loginUser';
import { RemoteJobStatus, StatusStepType } from '../../types/status';
import { setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';

export default function useRemoteStatus() {
  const history = useHistory();
  const queryClient = useQueryClient();
  const loggedInUser = useSelector(LoginUserSelector);
  const dispatch = useDispatch();

  const { data: remoteList, isFetching } = useQuery<RemoteJobStatus[]>(
    [QUERY_KEY.STATUS_REMOTE_LIST],
    getRemoteJobStatus,
    {
      onError: () => {
        openNotification('error', 'Error', `Failed to response the status of remote`);
      },
    }
  );

  const { mutateAsync: mutateExcuteAsync } = useMutation(
    [MUTATION_KEY.JOB_REMOTE_MANUAL_EXCUTE],
    (reqData: { jobId: number; type: StatusStepType }) => excuteManualRemoteJob(reqData.jobId, reqData.type)
  );

  const moveToRemoteNewJob = useCallback(() => {
    history.push(PAGE_URL.STATUS_REMOTE_ADD);
  }, [history]);

  const moveToRemoteEditJob = useCallback(
    (jobid: number, siteId: number, siteName: string) => {
      history.push(PAGE_URL.STATUS_REMOTE_EDIT({ jobid, siteId, siteName }));
    },
    [history]
  );

  const moveToRemoteHistory = useCallback(
    (id: number, siteName: string, type: StatusStepType) => {
      history.push(PAGE_URL.STATUS_REMOTE_BUILD_HISTORY({ id, type, siteName }));
    },
    [history]
  );

  const refreshRemoteList = useCallback(() => {
    queryClient.fetchQuery([QUERY_KEY.STATUS_REMOTE_LIST]);
  }, [queryClient]);

  const openStartStopModal = useCallback(
    ({
      action,
      jobId,
      siteId,
      jobName,
      prevStop,
    }: {
      action: 'start' | 'stop';
      jobId: number;
      siteId: number;
      jobName: string;
      prevStop: boolean;
    }) => {
      const actionText = action === 'start' ? 'Start' : 'End';
      const confirm = Modal.confirm({
        className: `${action}_remote_job`,
        title: `${actionText} Remote Job`,
        content: `Are you sure to ${action} remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getRemoteJobStopStatus(jobId);
            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (action === 'start') await startRemoteJob(jobId);
              else await stopRemoteJob(jobId);
              openNotification('success', 'Success', `Succeed to ${action} remote job '${jobName}'.`);
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to ${action} remote job '${jobName}'!`);
          } finally {
            refreshRemoteList();
          }
        },
      });

      const diableCancelBtn = () => {
        confirm.update({
          cancelButtonProps: {
            disabled: true,
          },
        });
      };
    },
    [refreshRemoteList]
  );

  const openDeleteModal = useCallback(
    ({ jobId, siteId, jobName, prevStop }: { jobId: number; siteId: number; jobName: string; prevStop: boolean }) => {
      const confirm = Modal.confirm({
        className: 'delete_remote_job',
        title: 'Delete Remote Job',
        content: `Are you sure to delete remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getRemoteJobStopStatus(jobId);

            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (stop) {
                await deleteRemoteJob(jobId);
                openNotification('success', 'Success', `Succeed to delete remote job '${jobName}'.`);
              } else {
                openNotification('error', 'Error', `After stop remote job '${jobName}', please try again!`);
              }
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to delete remote job '${jobName}'!`);
          } finally {
            refreshRemoteList();
          }
        },
      });

      const diableCancelBtn = () => {
        confirm.update({
          cancelButtonProps: {
            disabled: true,
          },
        });
      };
    },
    [refreshRemoteList]
  );

  const openEditeModal = useCallback(
    ({ jobId, siteId, jobName, prevStop }: { jobId: number; siteId: number; jobName: string; prevStop: boolean }) => {
      let isMoveEdit = false;
      const confirm = Modal.confirm({
        className: 'edit_remote_job',
        title: 'Edit Remote Job',
        content: `Are you sure to edit remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getRemoteJobStopStatus(jobId);
            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (stop) {
                isMoveEdit = true;
              } else {
                openNotification('error', 'Error', `After Stop remote job '${jobName}', please try again!`);
              }
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to edit remote job '${jobName}'!`);
          } finally {
            if (isMoveEdit) {
              moveToRemoteEditJob(jobId, siteId, jobName);
            } else {
              refreshRemoteList();
            }
          }
        },
      });

      const diableCancelBtn = () => {
        confirm.update({
          cancelButtonProps: {
            disabled: true,
          },
        });
      };
    },
    [moveToRemoteEditJob, refreshRemoteList]
  );

  const excuteManual = useCallback(
    async (reqData: { jobId: number; type: StatusStepType }, jobName: string) => {
      try {
        await mutateExcuteAsync(reqData);
        openNotification(
          'success',
          'Success',
          `Succeed to excute '${remoteStatusName(reqData.type)}' manual job from '${jobName}.`
        );
      } catch (e) {
        if ((e as AxiosError).response?.status === 404) {
          openNotification(
            'error',
            'Error',
            `Because ${jobName} is not Running, failed to excute '${remoteStatusName(reqData.type)}' manual job!`,
            e as AxiosError
          );
        } else {
          openNotification(
            'error',
            'Error',
            `Failed to excute '${remoteStatusName(reqData.type)}' manual job  from '${jobName}!`,
            e as AxiosError
          );
        }
      } finally {
        refreshRemoteList();
      }
    },
    [mutateExcuteAsync, refreshRemoteList]
  );

  const openScheduleModal = useCallback(
    (record: RemoteJobStatus) => {
      const { jobId, jobName, siteId, companyFabName: siteName } = record;
      dispatch(
        setRemoteJobInfoReducer({
          jobId,
          jobName,
          siteId,
          siteName,
          showTimeLine: true,
        })
      );
    },
    [dispatch]
  );

  return {
    remoteList,
    isFetching,
    refreshRemoteList,
    moveToRemoteNewJob,
    moveToRemoteEditJob,
    moveToRemoteHistory,
    openDeleteModal,
    openStartStopModal,
    openEditeModal,
    loggedInUser,
    excuteManual,
    openScheduleModal,
  };
}
