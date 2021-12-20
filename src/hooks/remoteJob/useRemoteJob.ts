import { Modal } from 'antd';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFetching, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { getRemoteJobInfo, postRemoteJob, putRemoteJob } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { hasArrayWithData, hasValue } from '../../lib/util/validation';
import {
  initialJobExcuteState,
  initialNotificationState,
  initRemoteJobReducer,
  remoteJobInfo,
  setRemoteJobInfoReducer,
} from '../../reducers/slices/remoteJob';
import { AddressOption } from '../../types/address';
import {
  RemoteJobExcuteState,
  RemoteJobReqData,
  RemoteJobResData,
  RemoteJobState,
  RemoteNotificationReqState,
  RemoteNotificationResState,
  RemoteNotificationState,
  REMOTE_JOB_STEP,
  REMOTE_JOB_VALIDATION_ERROR,
} from '../../types/remoteJob';

export type RemoteJobEditParams = {
  jobid: string;
};

export function useRemoteJob({ type }: { type: 'add' | 'edit' }) {
  const { jobid: jobId } = useParams<RemoteJobEditParams>();
  const { search } = useLocation();
  const { id, name } = queryString.parse(search);
  const [current, setCurrent] = useState(REMOTE_JOB_STEP.PLANS);
  const history = useHistory();
  const remoteJob = useSelector(remoteJobInfo);
  const dispatch = useDispatch();
  const isFetchingPlans = useIsFetching([QUERY_KEY.JOB_REMOTE_PLANS]);
  const isFetchingJudgeData = useIsFetching([QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST]);
  const isFetchingSiteList = useIsFetching([QUERY_KEY.STATUS_SITE_LIST]);

  const { data, isFetching: isFetchingJobData } = useQuery<RemoteJobResData>(
    [QUERY_KEY.JOB_REMOTE_JOB_INFO, remoteJob.jobId],
    () => getRemoteJobInfo(remoteJob.jobId as number),
    {
      enabled: !!remoteJob.jobId && type === 'edit',
      onError: () => {
        openNotification('error', 'Error', `Failed to get remote job information "${remoteJob.jobName}".`);
      },
      onSuccess: (data) => {
        const newData = convertRemoteJobResToState(data);
        dispatch(
          setRemoteJobInfoReducer({
            ...newData,
          })
        );
      },
    }
  );

  const disabledNext = useMemo(
    () => isFetchingPlans > 0 || isFetchingJudgeData > 0 || isFetchingSiteList > 0 || isFetchingJobData,
    [isFetchingPlans, isFetchingJudgeData, isFetchingJobData, isFetchingSiteList]
  );

  const onBack = useCallback(() => {
    history.push(PAGE_URL.STATUS_REMOTE);
  }, [history]);

  const openConfirmModal = useCallback(() => {
    const typeFirstUpper = type === 'add' ? 'Add' : 'Edit';
    const { jobId, jobName } = remoteJob;
    const confirm = Modal.confirm({
      className: `${type}_remote_job`,
      title: `${typeFirstUpper} Remote Job`,
      content: `Are you sure to ${type} remote job?`,

      onOk: async () => {
        diableCancelBtn();

        const reqData = convertRemoteJobStateToReq(remoteJob);

        try {
          if (type === 'add') {
            await postRemoteJob(reqData);
          } else {
            await putRemoteJob({ jobId: jobId as number, reqData: reqData });
          }
          openNotification('success', 'Success', `Succeed to ${type} remote job '${jobName}'.`);
        } catch (e) {
          openNotification('error', 'Error', `Failed to ${type} job '${jobName}'!`);
        } finally {
          onBack();
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
  }, [type, onBack, remoteJob]);

  const openWarningModal = useCallback((code: REMOTE_JOB_VALIDATION_ERROR) => {
    if (code !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
      const warning = Modal.warning({
        title: 'Warning',
        content: getRemoteJobErrorReasonText(code),
      });
    }
  }, []);

  const onNextAction = useCallback(async () => {
    if (current === REMOTE_JOB_STEP.CONFIRM) {
      openConfirmModal();
    } else {
      // const error = getRemoteJobErrorReasonCode({ current, remoteJob });
      // if (error !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
      //   openWarningModal(error);
      //   return false;
      // }

      const error = {
        [REMOTE_JOB_STEP.PLANS]: planValidation,
        [REMOTE_JOB_STEP.COLLECT_CONVERT]: collectConvertValidation,
        [REMOTE_JOB_STEP.NOTICE]: noticeValidation,
        [REMOTE_JOB_STEP.OTHER_SETTING]: otherValidation,
      }[current](remoteJob);

      if (error !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
        openWarningModal(error);
        return false;
      }
    }

    return true;
  }, [current, remoteJob, openWarningModal, openConfirmModal]);

  useEffect(() => {
    if (type === 'add') {
      dispatch(initRemoteJobReducer());
    } else {
      if (id && name && jobId) {
        dispatch(
          setRemoteJobInfoReducer({
            siteId: +id,
            jobId: +jobId,
            jobName: name as string,
          })
        );
      }
    }
  }, [type, id, name, jobId]);

  return {
    current,
    setCurrent,
    onBack,
    onNextAction,
    disabledNext,
  };
}

const planValidation = (remoteJob: RemoteJobState) => {
  if (!hasValue(remoteJob.jobName)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_JOB_NAME;
  }
  if (!hasValue(remoteJob.siteId)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_USER_FAB_NAME;
  }
  if (!hasArrayWithData(remoteJob.planIds)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_PLANS;
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

const collectConvertValidation = (remoteJob: RemoteJobState) => {
  const { collect, convert, isConvert } = remoteJob;

  if (collect.mode === 'time' && !hasArrayWithData(collect.time)) {
    return REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_TIME;
  }

  if (collect.mode === 'cycle' && !hasValue(collect.period)) {
    return REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_CYCLE;
  }

  if (isConvert) {
    if (convert.mode === 'time' && !hasArrayWithData(convert.time)) {
      return REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_TIME;
    }
    if (convert.mode === 'cycle' && !hasValue(convert.period)) {
      return REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_CYCLE;
    }
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

const noticeValidation = (remoteJob: RemoteJobState) => {
  const { isErrorSummary, isCrasData, isMpaVersion, errorSummary, crasData, mpaVersion } = remoteJob;

  if (isErrorSummary) {
    if (!hasArrayWithData(errorSummary.recipient)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_RECIPIENTS;
    }
    if (!hasValue(errorSummary.subject)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_SUBJECT;
    }
    if (errorSummary.mode === 'time' && !hasArrayWithData(errorSummary.time)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_TIME;
    }
    if (errorSummary.mode === 'cycle' && !hasValue(errorSummary.period)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_CYCLE;
    }
    if (!hasValue(errorSummary.before)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_BEFORE;
    }
  }

  if (isCrasData) {
    if (!hasArrayWithData(crasData.recipient)) {
      return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_RECIPIENTS;
    }
    if (!hasValue(crasData.subject)) {
      return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_SUBJECT;
    }
    if (crasData.mode === 'time' && !hasArrayWithData(crasData.time)) {
      return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_TIME;
    }
    if (crasData.mode === 'cycle' && !hasValue(crasData.period)) {
      return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_CYCLE;
    }
    if (!hasValue(crasData.before)) {
      return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_BEFORE;
    }
  }

  if (isMpaVersion) {
    if (!hasArrayWithData(mpaVersion.recipient)) {
      return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_RECIPIENTS;
    }
    if (!hasValue(mpaVersion.subject)) {
      return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_SUBJECT;
    }
    if (mpaVersion.mode === 'time' && !hasArrayWithData(mpaVersion.time)) {
      return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_TIME;
    }
    if (mpaVersion.mode === 'cycle' && !hasValue(mpaVersion.period)) {
      return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_CYCLE;
    }
    if (!hasValue(mpaVersion.before)) {
      return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_BEFORE;
    }
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

const otherValidation = (remoteJob: RemoteJobState) => {
  const { isDbPurge, isErrorNotice, dbPurge, errorNotice } = remoteJob;

  if (isDbPurge) {
    if (dbPurge.mode === 'time' && !hasArrayWithData(dbPurge.time)) {
      return REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_TIME;
    }
    if (dbPurge.mode === 'cycle' && !hasValue(dbPurge.period)) {
      return REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_CYCLE;
    }
  }

  if (isErrorNotice) {
    if (!hasArrayWithData(errorNotice.recipient)) {
      return REMOTE_JOB_VALIDATION_ERROR.ERROR_NOTICE_NO_RECIPIENTS;
    }
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

// function getRemoteJobErrorReasonCode({ current, remoteJob }: { current: number; remoteJob: RemoteJobState }) {
//   switch (current) {
//     case REMOTE_JOB_STEP.PLANS:
//       if (!remoteJob.jobName) {
//         return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_JOB_NAME;
//       }
//       if (!remoteJob.siteId) {
//         return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_USER_FAB_NAME;
//       }
//       if (remoteJob.planIds.length === 0) {
//         return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_PLANS;
//       }
//       break;

//     case REMOTE_JOB_STEP.COLLECT_CONVERT:
//       if (remoteJob.collect.mode === 'time' && remoteJob.collect.time.length === 0) {
//         return REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_TIME;
//       } else if (remoteJob.collect.mode === 'cycle' && !remoteJob.collect.period) {
//         return REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_CYCLE;
//       }

//       if (remoteJob.isConvert) {
//         if (remoteJob.convert.mode === 'time' && remoteJob.convert.time.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_TIME;
//         } else if (remoteJob.convert.mode === 'cycle' && !remoteJob.convert.period) {
//           return REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_CYCLE;
//         }
//       }
//       break;

//     case REMOTE_JOB_STEP.NOTICE:
//       if (remoteJob.isErrorSummary) {
//         if (remoteJob.errorSummary.recipient.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_RECIPIENTS;
//         }
//         if (!remoteJob.errorSummary.subject) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_SUBJECT;
//         }
//         if (remoteJob.errorSummary.mode === 'time' && remoteJob.errorSummary.time.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_TIME;
//         } else if (remoteJob.errorSummary.mode === 'cycle' && !remoteJob.errorSummary.period) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_CYCLE;
//         }
//         if (!remoteJob.errorSummary.before) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_BEFORE;
//         }
//       }

//       if (remoteJob.isCrasData) {
//         if (remoteJob.crasData.recipient.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_RECIPIENTS;
//         }
//         if (!remoteJob.crasData.subject) {
//           return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_SUBJECT;
//         }
//         if (remoteJob.crasData.mode === 'time' && remoteJob.crasData.time.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_TIME;
//         } else if (remoteJob.crasData.mode === 'cycle' && !remoteJob.crasData.period) {
//           return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_CYCLE;
//         }
//         if (!remoteJob.crasData.before) {
//           return REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_BEFORE;
//         }
//       }

//       if (remoteJob.isMpaVersion) {
//         if (remoteJob.mpaVersion.recipient.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_RECIPIENTS;
//         }
//         if (!remoteJob.mpaVersion.subject) {
//           return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_SUBJECT;
//         }
//         if (remoteJob.mpaVersion.mode === 'time' && remoteJob.mpaVersion.time.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_TIME;
//         } else if (remoteJob.mpaVersion.mode === 'cycle' && !remoteJob.mpaVersion.period) {
//           return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_CYCLE;
//         }
//         if (!remoteJob.mpaVersion.before) {
//           return REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_BEFORE;
//         }
//       }
//       break;

//     case REMOTE_JOB_STEP.OTHER_SETTING:
//       if (remoteJob.isDbPurge) {
//         if (remoteJob.dbPurge.mode === 'time' && remoteJob.dbPurge.time.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_TIME;
//         } else if (remoteJob.dbPurge.mode === 'cycle' && !remoteJob.dbPurge.period) {
//           return REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_CYCLE;
//         }
//       }

//       if (remoteJob.isErrorNotice) {
//         if (remoteJob.errorNotice.recipient.length === 0) {
//           return REMOTE_JOB_VALIDATION_ERROR.ERROR_NOTICE_NO_RECIPIENTS;
//         }
//       }
//       break;
//   }
//   return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
// }

const getRemoteJobErrorReasonText = (code: REMOTE_JOB_VALIDATION_ERROR) =>
  ({
    // Plans
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_JOB_NAME]: 'Please input a job name!',
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_USER_FAB_NAME]: 'Please select a user-fab name!',
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_PLANS]: 'Please select plans!',

    // Collect & Convert
    // Collect
    [REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_TIME]: 'Please add specified times of collect!',
    [REMOTE_JOB_VALIDATION_ERROR.COLLECT_NO_CYCLE]: 'Please input a cycle value greater than 0 of collect!',

    // Convert
    [REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_TIME]: 'Please add specified times of convert & insert!',
    [REMOTE_JOB_VALIDATION_ERROR.CONVERT_NO_CYCLE]: 'Please input a cycle value greater than 0 of covert & insert!',

    // Notification
    // Error Summary
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_RECIPIENTS]: 'Please add recipients of error summuary!',
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_SUBJECT]: 'Please input a subject of error summary!',
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_TIME]: 'Please add specified times of error summary!',
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_CYCLE]: 'Please input a cycle value greater than 0 of error summary!',
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_SUMMARY_NO_BEFORE]:
      'Please input a before value greater than 0 of error summary!',

    // Cras Data
    [REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_RECIPIENTS]: 'Please add recipients of cras data!',
    [REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_SUBJECT]: 'Please input a subject of cras!',
    [REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_TIME]: 'Please add specified times of cras data!',
    [REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_CYCLE]: 'Please input a cycle value greater than 0 of cras data!',
    [REMOTE_JOB_VALIDATION_ERROR.CRAS_DATA_NO_BEFORE]: 'Please input a before value greater than 0 of cras data!',

    // MPA Version
    [REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_RECIPIENTS]: 'Please add recipients of mpa version!',
    [REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_SUBJECT]: 'Please input a subject of mpa version!',
    [REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_TIME]: 'Please add specified times of mpa version!',
    [REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_CYCLE]: 'Please input a cycle value greater than 0 of mpa version!',
    [REMOTE_JOB_VALIDATION_ERROR.MPA_VERSION_NO_BEFORE]: 'Please input a before value greater than 0 of mpa version!',

    // Other Setting
    // DB Purge
    [REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_TIME]: 'Please add specified times of db purge!',
    [REMOTE_JOB_VALIDATION_ERROR.DB_PURGE_NO_CYCLE]: 'Please input a cycle value greater than 0 of db purge!',

    // Error Notice
    [REMOTE_JOB_VALIDATION_ERROR.ERROR_NOTICE_NO_RECIPIENTS]: 'Please add recipients of error notice!',
  }[code as number] ?? 'Unknown Error!');

function convertExcuteState(data: RemoteJobExcuteState) {
  const { mode, time, cycle, period, script } = data;
  return {
    mode,
    time: time || [],
    cycle,
    period: period || 1,
    script,
  };
}

export function convertNotificationState(data: RemoteNotificationResState): RemoteNotificationState {
  const {
    mode,
    time,
    cycle,
    period,
    script,
    subject,
    body,
    before,
    customEmails,
    emailBook,
    groupBook,
    selectJudgeRules,
  } = data;

  return {
    mode,
    time: time || [],
    cycle,
    period: period || 1,
    script,
    subject,
    body,
    before,
    recipient: convertRecipientState({ groupBook, emailBook, customEmails }),
    selectJudgeRules: selectJudgeRules?.map((item) => ({ ...item, key: item.itemId.toString() })) || [],
    totalJudgeRules: 0,
  };
}

export function convertRecipientState({
  groupBook,
  emailBook,
  customEmails,
}: {
  groupBook: AddressOption[] | null;
  emailBook: AddressOption[] | null;
  customEmails: string[] | null;
}): AddressOption[] {
  const newRecipients: AddressOption[] = [];
  if (groupBook && groupBook.length > 0) {
    groupBook.map((item) => {
      const { id, name, email, group } = item;
      newRecipients.push({
        id,
        name,
        email,
        group,
        label: `@${name}`,
        value: id.toString(),
      });
    });
  }

  if (emailBook && emailBook.length > 0) {
    emailBook.map((item) => {
      const { id, name, email, group } = item;
      newRecipients.push({
        id,
        name,
        email,
        group,
        label: `${name} <${email}>`,
        value: id.toString(),
      });
    });
  }

  if (customEmails && customEmails.length > 0) {
    customEmails.map((item) => {
      newRecipients.push({
        id: 0,
        name: item,
        email: item,
        group: false,
        label: item,
        value: item,
      });
    });
  }

  return newRecipients;
}

export function convertRemoteJobResToState(data: RemoteJobResData): Partial<RemoteJobState> {
  const {
    siteId,
    siteName,
    jobId,
    jobName,
    planIds,
    isConvert,
    isErrorSummary,
    isCrasData,
    isMpaVersion,
    isDbPurge,
    isErrorNotice,
    collect,
    convert,
    errorSummary,
    crasData,
    mpaVersion,
    dbPurge,
    errorNotice,
  } = data;

  const newCollect = collect ? convertExcuteState(collect) : initialJobExcuteState;
  const newConvert = isConvert && convert ? convertExcuteState(convert) : initialJobExcuteState;
  const newErrorSummary =
    isErrorSummary && errorSummary ? convertNotificationState(errorSummary) : initialNotificationState('error');
  const newCrasData = isCrasData && crasData ? convertNotificationState(crasData) : initialNotificationState('cras');
  const newMpaVersion =
    isMpaVersion && mpaVersion ? convertNotificationState(mpaVersion) : initialNotificationState('version');
  const newDbPurge = isDbPurge && dbPurge ? convertExcuteState(dbPurge) : initialJobExcuteState;
  const newErrorNotice =
    isErrorNotice && errorNotice ? convertNotificationState(errorNotice) : initialNotificationState('notice');

  return {
    siteId,
    siteName,
    jobId,
    jobName,
    planIds,
    isConvert,
    isErrorSummary,
    isCrasData,
    isMpaVersion,
    isDbPurge,
    isErrorNotice,
    collect: newCollect,
    convert: newConvert,
    errorSummary: newErrorSummary,
    crasData: newCrasData,
    mpaVersion: newMpaVersion,
    dbPurge: newDbPurge,
    errorNotice: newErrorNotice,
  };
}

export function convertNotificationReq(data: RemoteNotificationState): RemoteNotificationReqState {
  const { mode, time, cycle, period, script, subject, body, before, recipient, selectJudgeRules } = data;
  let customEmails: string[] = [];
  let emailBookIds: number[] = [];
  let groupBookIds: number[] = [];
  let newSelectJudgeRules: number[] = [];

  if (recipient && recipient.length > 0) {
    customEmails = recipient.filter((item) => item.id <= 0).map((filtered) => filtered.email);
    emailBookIds = recipient.filter((item) => !item.group && item.id > 0).map((filtered) => filtered.id);
    groupBookIds = recipient.filter((item) => item.group).map((filtered) => filtered.id);
  }

  if (selectJudgeRules && selectJudgeRules.length > 0) {
    newSelectJudgeRules = selectJudgeRules.map((item) => item.itemId);
  }

  return {
    mode,
    time,
    cycle,
    period,
    script,
    subject,
    body,
    before,
    customEmails,
    emailBookIds,
    groupBookIds,
    selectJudgeRules: newSelectJudgeRules,
  };
}

export function convertRemoteJobStateToReq(data: RemoteJobState): RemoteJobReqData {
  const {
    siteId,
    siteName,
    jobId,
    jobName,
    planIds,
    isConvert,
    isErrorSummary,
    isCrasData,
    isMpaVersion,
    isDbPurge,
    isErrorNotice,
    collect,
    convert,
    errorSummary,
    crasData,
    mpaVersion,
    dbPurge,
    errorNotice,
  } = data;

  const newConvert = isConvert ? convert : null;
  const newErrorSummary = isErrorSummary ? convertNotificationReq(errorSummary) : null;
  const newCrasData = isCrasData ? convertNotificationReq(crasData) : null;
  const newMpaVersion = isMpaVersion ? convertNotificationReq(mpaVersion) : null;
  const newDbPurge = isDbPurge ? dbPurge : null;
  const newErrorNotice = isErrorNotice ? convertNotificationReq(errorNotice) : null;

  return {
    siteId,
    siteName,
    jobId,
    jobName,
    planIds,
    isConvert,
    isErrorSummary,
    isCrasData,
    isMpaVersion,
    isDbPurge,
    isErrorNotice,
    collect: collect,
    convert: newConvert,
    errorSummary: newErrorSummary,
    crasData: newCrasData,
    mpaVersion: newMpaVersion,
    dbPurge: newDbPurge,
    errorNotice: newErrorNotice,
  };
}
