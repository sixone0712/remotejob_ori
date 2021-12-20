import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CRAS_DATA_DEFAULT_BEFORE,
  ERROR_SUMMARY_DEFAULT_BEFORE,
  MPA_VERSION_DEFAULT_BEFORE,
} from '../../lib/constants';
import {
  RemoteJobEnableName,
  RemoteJobExcuteModeScriptName,
  RemoteJobExcuteState,
  RemoteJobNoticeName,
  RemoteJobState,
  RemoteNotificationState,
  RemoteShowAddrState,
  RemoteShowScriptName,
  RemoteShowScriptState,
} from '../../types/remoteJob';
import { RootState } from '../rootReducer';

export const initialJobExcuteState: RemoteJobExcuteState = {
  mode: 'time',
  time: [],
  cycle: 'hour',
  period: 1,
  script: {
    previous: null,
    next: null,
  },
};

export const initialNotificationState = (type: 'error' | 'cras' | 'version' | 'notice'): RemoteNotificationState => {
  let before = 0;

  if (type === 'error') {
    before = ERROR_SUMMARY_DEFAULT_BEFORE;
  } else if (type === 'cras') {
    before = CRAS_DATA_DEFAULT_BEFORE;
  } else {
    before = MPA_VERSION_DEFAULT_BEFORE;
  }

  return {
    subject: null,
    body: null,
    before,
    recipient: [],
    selectJudgeRules: [],
    totalJudgeRules: 0,
    ...initialJobExcuteState,
  };
};

const initialShowScriptState: RemoteShowScriptState = {
  isConvertPrev: false,
  isConvertNext: false,
  isCollectPrev: false,
  isCollectNext: false,
  isCrasDataPrev: false,
  isCrasDataNext: false,
  isErrorSummaryPrev: false,
  isErrorSummaryNext: false,
  isMpaVersionPrev: false,
  isMpaVersionNext: false,
  isDbPurgePrev: false,
  isDbPurgeNext: false,
  isErrorNoticePrev: false,
  isErrorNoticeNext: false,
};

const initialShowAddrState: RemoteShowAddrState = {
  isErrorSummaryAddr: false,
  isCrasDataAddr: false,
  isMpaVersionAddr: false,
  isErrorNoticeAddr: false,
};

const initialState: RemoteJobState = {
  siteId: null,
  siteName: null,
  jobId: null,
  jobName: null,
  planIds: [],
  isConvert: false,
  isErrorSummary: false,
  isCrasData: false,
  isMpaVersion: false,
  isDbPurge: false,
  isErrorNotice: false,
  collect: initialJobExcuteState,
  convert: initialJobExcuteState,
  errorSummary: initialNotificationState('cras'),
  crasData: initialNotificationState('error'),
  mpaVersion: initialNotificationState('version'),
  dbPurge: initialJobExcuteState,
  errorNotice: initialNotificationState('notice'),
  jobType: null,
  showScript: initialShowScriptState,
  showScriptImport: initialShowScriptState,
  showAddr: initialShowAddrState,
  showJudgeRule: false,
  showTimeLine: false,
};

const remoteJob = createSlice({
  name: 'remoteJob',
  initialState,
  reducers: {
    initRemoteJobReducer: () => initialState,
    setRemoteJobInfoReducer: (state, action: PayloadAction<Partial<RemoteJobState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setRemoteJobCollectReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState>>) => {
      return {
        ...state,
        collect: {
          ...state.collect,
          ...action.payload,
        },
      };
    },
    setRemoteJobCollectScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        collect: {
          ...state.collect,
          script: {
            ...state.collect.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteJobConvertReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState>>) => {
      return {
        ...state,
        convert: {
          ...state.convert,
          ...action.payload,
        },
      };
    },
    setRemoteJobConvertScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        convert: {
          ...state.convert,
          script: {
            ...state.convert.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteJobErrorSummaryReducer: (state, action: PayloadAction<Partial<RemoteNotificationState>>) => {
      return {
        ...state,
        errorSummary: {
          ...state.errorSummary,
          ...action.payload,
        },
      };
    },
    setRemoteJobErrorSummaryScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        errorSummary: {
          ...state.errorSummary,
          script: {
            ...state.errorSummary.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteJobCrasDataReducer: (state, action: PayloadAction<Partial<RemoteNotificationState>>) => {
      return {
        ...state,
        crasData: {
          ...state.crasData,
          ...action.payload,
        },
      };
    },
    setRemoteJobCrasDataScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        crasData: {
          ...state.crasData,
          script: {
            ...state.crasData.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteJobMpaVersionReducer: (state, action: PayloadAction<Partial<RemoteNotificationState>>) => {
      return {
        ...state,
        mpaVersion: {
          ...state.mpaVersion,
          ...action.payload,
        },
      };
    },
    setRemoteJobMpaVersionScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        mpaVersion: {
          ...state.mpaVersion,
          script: {
            ...state.mpaVersion.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteJobDbPurgeReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState>>) => {
      return {
        ...state,
        dbPurge: {
          ...state.dbPurge,
          ...action.payload,
        },
      };
    },
    setRemoteJobDbPurgeScriptReducer: (state, action: PayloadAction<Partial<RemoteJobExcuteState['script']>>) => {
      return {
        ...state,
        dbPurge: {
          ...state.dbPurge,
          script: {
            ...state.dbPurge.script,
            ...action.payload,
          },
        },
      };
    },
    setRemoteErrorNoticeReducer: (state, action: PayloadAction<Partial<RemoteNotificationState>>) => {
      return {
        ...state,
        errorNotice: {
          ...state.errorNotice,
          ...action.payload,
        },
      };
    },

    setRemoteShowScriptReducer: (state, action: PayloadAction<Partial<RemoteShowScriptState>>) => {
      return {
        ...state,
        showScript: {
          ...state.showScript,
          ...action.payload,
        },
      };
    },

    setRemoteShowScriptImportReducer: (state, action: PayloadAction<Partial<RemoteShowScriptState>>) => {
      return {
        ...state,
        showScriptImport: {
          ...state.showScriptImport,
          ...action.payload,
        },
      };
    },

    setRemoteShowAddrReducer: (state, action: PayloadAction<Partial<RemoteShowAddrState>>) => {
      return {
        ...state,
        showAddr: {
          ...state.showAddr,
          ...action.payload,
        },
      };
    },
  },
});

export const {
  initRemoteJobReducer,
  setRemoteJobInfoReducer,
  setRemoteJobCollectReducer,
  setRemoteJobConvertReducer,
  setRemoteJobErrorSummaryReducer,
  setRemoteJobCrasDataReducer,
  setRemoteJobMpaVersionReducer,
  setRemoteJobDbPurgeReducer,
  setRemoteErrorNoticeReducer,
  setRemoteJobCollectScriptReducer,
  setRemoteJobConvertScriptReducer,
  setRemoteJobErrorSummaryScriptReducer,
  setRemoteJobCrasDataScriptReducer,
  setRemoteJobMpaVersionScriptReducer,
  setRemoteJobDbPurgeScriptReducer,
  setRemoteShowScriptReducer,
  setRemoteShowScriptImportReducer,
  setRemoteShowAddrReducer,
} = remoteJob.actions;

export const remoteJobSelectJob = (
  state: RootState
): Pick<RemoteJobState, 'siteId' | 'siteName' | 'jobId' | 'jobName' | 'jobType'> => {
  const { siteId, siteName, jobId, jobName, jobType } = state.remoteJob;
  return {
    siteId,
    siteName,
    jobId,
    jobName,
    jobType,
  } as Pick<RemoteJobState, 'siteId' | 'siteName' | 'jobId' | 'jobName' | 'jobType'>;
};

export const remoteJobInfo = (state: RootState): RemoteJobState => state.remoteJob;
export const remoteJobPlanIds = (state: RootState): RemoteJobState['planIds'] => state.remoteJob.planIds;
export const remoteJobCollect = (state: RootState): RemoteJobState['collect'] => state.remoteJob.collect;
export const remoteJobConvert = (state: RootState): RemoteJobState['convert'] => state.remoteJob.convert;
export const remoteJobIsErrorSummary = (state: RootState): RemoteJobState['isErrorSummary'] =>
  state.remoteJob.isErrorSummary;
export const remoteJobErrorSummary = (state: RootState): RemoteJobState['errorSummary'] => state.remoteJob.errorSummary;
export const remoteJobIsCrasData = (state: RootState): RemoteJobState['isCrasData'] => state.remoteJob.isCrasData;
export const remoteJobCrasData = (state: RootState): RemoteJobState['crasData'] => state.remoteJob.crasData;
export const remoteJobShowJudgeRule = (state: RootState): boolean => state.remoteJob.showJudgeRule;
export const remoteJobIsMpaVersion = (state: RootState): RemoteJobState['isMpaVersion'] => state.remoteJob.isMpaVersion;
export const remoteJobMpaVersion = (state: RootState): RemoteJobState['mpaVersion'] => state.remoteJob.mpaVersion;
export const remoteJobIsDbPurge = (state: RootState): RemoteJobState['isDbPurge'] => state.remoteJob.isDbPurge;
export const remoteJobDbPurge = (state: RootState): RemoteJobState['dbPurge'] => state.remoteJob.dbPurge;
export const remoteJobErrorNotice = (state: RootState): RemoteJobState['errorNotice'] => state.remoteJob.errorNotice;

// export const remoteJobRequestData = (): Selector<
//   RootState,
//   Omit<RemoteJobState, 'siteId' | 'siteName' | 'jobId' | 'jobName' | 'jobType' | 'showAddrBook'>
// > =>
//   createSelector(
//     [(state) => state.remoteJob],
//     ({
//       planIds,
//       isErrorSummary,
//       isCrasData,
//       isMpaVersion,
//       isDbPurge,
//       collect,
//       convert,
//       errorSummary,
//       crasData,
//       mpaVersion,
//       dbPurge,
//     }): Omit<RemoteJobState, 'siteId' | 'siteName' | 'jobId' | 'jobName' | 'jobType' | 'showAddrBook'> => ({
//       planIds,
//       isErrorSummary,
//       isCrasData,
//       isMpaVersion,
//       isDbPurge,
//       collect,
//       convert,
//       errorSummary,
//       crasData,
//       mpaVersion,
//       dbPurge,
//     })
//   );

export const remoteExcuteState = (name: RemoteJobExcuteModeScriptName) =>
  createSelector<RootState, RemoteJobState, RemoteJobExcuteState>(remoteJobInfo, (state) => {
    const { mode, time, cycle, period, script } = state[name];
    return {
      mode,
      time,
      cycle,
      period,
      script,
    };
  });

export const remoteNoitceEmailState = (name: RemoteJobNoticeName) =>
  createSelector<RootState, RemoteJobState, Pick<RemoteNotificationState, 'subject' | 'body' | 'recipient'>>(
    remoteJobInfo,
    (state) => {
      const { recipient, subject, body } = state[name];
      return {
        recipient,
        subject,
        body,
      };
    }
  );

export const remoteNoitceBeforeState = (name: RemoteJobNoticeName) =>
  createSelector<RootState, RemoteJobState, Pick<RemoteNotificationState, 'before'>>(remoteJobInfo, (state) => {
    const { before } = state[name];
    return {
      before,
    };
  });

export const remoteNoitceJudgeRulesState = (name: RemoteJobNoticeName) =>
  createSelector<RootState, RemoteJobState, Pick<RemoteNotificationState, 'selectJudgeRules'>>(
    remoteJobInfo,
    (state) => {
      const { selectJudgeRules } = state[name];
      return {
        selectJudgeRules,
      };
    }
  );

export const remoteEnableSetting = (name: RemoteJobEnableName) =>
  createSelector<RootState, RemoteJobState, boolean>(
    remoteJobInfo,
    (state) =>
      ({
        ['convert']: state.isConvert,
        ['crasData']: state.isCrasData,
        ['errorSummary']: state.isErrorSummary,
        ['mpaVersion']: state.isMpaVersion,
        ['dbPurge']: state.isDbPurge,
        ['errorNotice']: state.isErrorNotice,
      }[name] ?? true)
  );

export const remoteShowScript = (name: RemoteShowScriptName) =>
  createSelector<RootState, RemoteJobState, { isPrev: boolean; isNext: boolean }>(
    remoteJobInfo,
    (state) =>
      ({
        ['collect']: {
          isPrev: state.showScript.isCollectPrev,
          isNext: state.showScript.isCollectNext,
        },
        ['convert']: {
          isPrev: state.showScript.isConvertPrev,
          isNext: state.showScript.isConvertNext,
        },
        ['errorSummary']: {
          isPrev: state.showScript.isErrorSummaryPrev,
          isNext: state.showScript.isErrorSummaryNext,
        },
        ['crasData']: {
          isPrev: state.showScript.isCrasDataPrev,
          isNext: state.showScript.isCrasDataNext,
        },
        ['mpaVersion']: {
          isPrev: state.showScript.isMpaVersionPrev,
          isNext: state.showScript.isMpaVersionNext,
        },
        ['dbPurge']: {
          isPrev: state.showScript.isDbPurgePrev,
          isNext: state.showScript.isDbPurgeNext,
        },
      }[name as string] ?? { isPrev: false, isNext: false })
  );

export const remoteShowScriptImport = (name: RemoteShowScriptName) =>
  createSelector<RootState, RemoteJobState, { isPrev: boolean; isNext: boolean }>(
    remoteJobInfo,
    (state) =>
      ({
        ['collect']: {
          isPrev: state.showScriptImport.isCollectPrev,
          isNext: state.showScriptImport.isCollectNext,
        },
        ['convert']: {
          isPrev: state.showScriptImport.isConvertPrev,
          isNext: state.showScriptImport.isConvertNext,
        },
        ['errorSummary']: {
          isPrev: state.showScriptImport.isErrorSummaryPrev,
          isNext: state.showScriptImport.isErrorSummaryNext,
        },
        ['crasData']: {
          isPrev: state.showScriptImport.isCrasDataPrev,
          isNext: state.showScriptImport.isCrasDataNext,
        },
        ['mpaVersion']: {
          isPrev: state.showScriptImport.isMpaVersionPrev,
          isNext: state.showScriptImport.isMpaVersionNext,
        },
        ['dbPurge']: {
          isPrev: state.showScriptImport.isDbPurgePrev,
          isNext: state.showScriptImport.isDbPurgeNext,
        },
      }[name as string] ?? { isPrev: false, isNext: false })
  );
export const remoteShowAddr = (name: RemoteJobNoticeName) =>
  createSelector<RootState, RemoteJobState, boolean>(
    remoteJobInfo,
    (state) =>
      ({
        ['errorSummary']: state.showAddr.isErrorSummaryAddr,
        ['crasData']: state.showAddr.isCrasDataAddr,
        ['mpaVersion']: state.showAddr.isMpaVersionAddr,
        ['errorNotice']: state.showAddr.isErrorNoticeAddr,
      }[name])
  );

export const remoteShowTimeLine = (state: RootState): RemoteJobState['showTimeLine'] => state.remoteJob.showTimeLine;
export default remoteJob.reducer;
