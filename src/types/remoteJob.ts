import { AddressOption } from './address';
import { BuildStatus } from './status';

export interface RemoteJobExcuteState {
  mode: 'time' | 'cycle';
  time: string[];
  cycle: 'day' | 'minute' | 'hour';
  period: number;
  script: {
    previous: string | null;
    next: string | null;
  };
}

export interface RemoteNotificationState extends RemoteJobExcuteState {
  subject: string | null;
  body: string | null;
  before: number;
  recipient: AddressOption[];
  selectJudgeRules?: TransferRemoteJobJudgeRule[];
  totalJudgeRules?: number;
}

export interface RemoteNotificationReqState extends RemoteJobExcuteState {
  subject: string | null;
  body: string | null;
  before: number;
  customEmails: string[];
  emailBookIds: number[];
  groupBookIds: number[];
  selectJudgeRules?: number[];
}

export interface RemoteNotificationResState extends RemoteJobExcuteState {
  subject: string | null;
  body: string | null;
  before: number;
  customEmails: string[] | null;
  emailBook: AddressOption[] | null;
  groupBook: AddressOption[] | null;
  selectJudgeRules?: TransferRemoteJobJudgeRule[] | null;
}

export interface RemoteShowScriptState {
  isConvertPrev: boolean;
  isConvertNext: boolean;
  isCollectPrev: boolean;
  isCollectNext: boolean;
  isCrasDataPrev: boolean;
  isCrasDataNext: boolean;
  isErrorSummaryPrev: boolean;
  isErrorSummaryNext: boolean;
  isMpaVersionPrev: boolean;
  isMpaVersionNext: boolean;
  isDbPurgePrev: boolean;
  isDbPurgeNext: boolean;
  isErrorNoticePrev: boolean;
  isErrorNoticeNext: boolean;
}

export interface RemoteShowAddrState {
  isErrorSummaryAddr: boolean;
  isCrasDataAddr: boolean;
  isMpaVersionAddr: boolean;
  isErrorNoticeAddr: boolean;
}

export interface RemoteJobState {
  siteId: number | null;
  siteName: string | null;
  jobId: number | null;
  jobName: string | null;
  planIds: number[];
  isConvert: boolean;
  isErrorSummary: boolean;
  isCrasData: boolean;
  isMpaVersion: boolean;
  isDbPurge: boolean;
  isErrorNotice: boolean;
  collect: RemoteJobExcuteState;
  convert: RemoteJobExcuteState;
  errorSummary: RemoteNotificationState;
  crasData: RemoteNotificationState;
  mpaVersion: RemoteNotificationState;
  dbPurge: RemoteJobExcuteState;
  errorNotice: RemoteNotificationState;

  /* Used only on the front-end */
  jobType: string | null;
  showScript: RemoteShowScriptState;
  showScriptImport: RemoteShowScriptState;
  showAddr: RemoteShowAddrState;
  showJudgeRule: boolean;
  showTimeLine: boolean;
}

export interface RemoteJobResData
  extends Omit<
    RemoteJobState,
    | 'jobType'
    | 'showScript'
    | 'showScriptImport'
    | 'showAddr'
    | 'showJudgeRule'
    | 'convert'
    | 'errorSummary'
    | 'crasData'
    | 'mpaVersion'
    | 'dbPurge'
    | 'errorNotice'
  > {
  convert: RemoteJobExcuteState | null;
  errorSummary: RemoteNotificationResState | null;
  crasData: RemoteNotificationResState | null;
  mpaVersion: RemoteNotificationResState | null;
  dbPurge: RemoteNotificationResState | null;
  errorNotice: RemoteNotificationResState | null;
}

export interface RemoteJobReqData
  extends Omit<
    RemoteJobState,
    | 'jobType'
    | 'showScript'
    | 'showScriptImport'
    | 'showAddr'
    | 'showJudgeRule'
    | 'showTimeLine'
    | 'convert'
    | 'errorSummary'
    | 'crasData'
    | 'mpaVersion'
    | 'dbPurge'
    | 'errorNotice'
  > {
  convert: RemoteJobExcuteState | null;
  errorSummary: RemoteNotificationReqState | null;
  crasData: RemoteNotificationReqState | null;
  mpaVersion: RemoteNotificationReqState | null;
  dbPurge: RemoteJobExcuteState | null;
  errorNotice: RemoteNotificationReqState | null;
}

export const remoteJobStepList = ['Plans Setting', 'Collect & Convert', 'Notice Setting', 'Other Setting', 'Confirm'];

export enum REMOTE_JOB_STEP {
  PLANS,
  COLLECT_CONVERT,
  NOTICE,
  OTHER_SETTING,
  CONFIRM,
}

export type RemoteJobName = keyof Pick<
  RemoteJobState,
  'collect' | 'convert' | 'errorSummary' | 'crasData' | 'mpaVersion' | 'dbPurge' | 'errorNotice'
>;

export type RemoteJobExcuteModeScriptName =
  | 'collect'
  | 'convert'
  | 'errorSummary'
  | 'crasData'
  | 'mpaVersion'
  | 'dbPurge'
  | 'errorNotice';

export type RemoteJobNoticeName = 'errorSummary' | 'crasData' | 'mpaVersion' | 'errorNotice';

export type RemoteJobEnableName = 'convert' | 'errorSummary' | 'crasData' | 'mpaVersion' | 'dbPurge' | 'errorNotice';

export type RemoteShowScriptName =
  | 'collect'
  | 'convert'
  | 'dbPurge'
  | 'errorSummary'
  | 'crasData'
  | 'mpaVersion'
  | 'dbPurge'
  | 'errorNotice';

export type RemoteScriptName = 'previous' | 'next';

export interface RemoteJobJudgeRule {
  itemId: number;
  itemName: string;
  enable: boolean;
}

export interface TransferRemoteJobJudgeRule extends RemoteJobJudgeRule {
  key: string;
}

export enum REMOTE_JOB_VALIDATION_ERROR {
  NO_ERROR = 0,
  PLAN_NO_JOB_NAME,
  PLAN_NO_USER_FAB_NAME,
  PLAN_NO_PLANS,

  COLLECT_NO_TIME,
  COLLECT_NO_CYCLE,
  CONVERT_NO_TIME,
  CONVERT_NO_CYCLE,

  ERROR_SUMMARY_NO_RECIPIENTS,
  ERROR_SUMMARY_NO_SUBJECT,
  ERROR_SUMMARY_NO_TIME,
  ERROR_SUMMARY_NO_CYCLE,
  ERROR_SUMMARY_NO_BEFORE,

  CRAS_DATA_NO_RECIPIENTS,
  CRAS_DATA_NO_SUBJECT,
  CRAS_DATA_NO_TIME,
  CRAS_DATA_NO_CYCLE,
  CRAS_DATA_NO_BEFORE,

  MPA_VERSION_NO_RECIPIENTS,
  MPA_VERSION_NO_SUBJECT,
  MPA_VERSION_NO_TIME,
  MPA_VERSION_NO_CYCLE,
  MPA_VERSION_NO_BEFORE,

  DB_PURGE_NO_TIME,
  DB_PURGE_NO_CYCLE,

  ERROR_NOTICE_NO_RECIPIENTS,
}

export enum REMOTE_PLAN_DETAIL {
  REGISTERED = 'registered',
  COLLECTING = 'collecting',
  COLLECTED = 'collected',
  SUSPENDED = 'suspended',
  HALTED = 'halted',
  COMPLETED = 'completed',
}

export type RemoteJobTimeLineName = 'convert' | 'collect' | 'error' | 'cras' | 'version' | 'purge';

export interface RemoteJobTimeLine {
  start: string;
  runningStart?: string;
  end?: string;
  name: RemoteJobTimeLineName;
  status: BuildStatus;
  isManual: boolean;
  logId?: string;
}
