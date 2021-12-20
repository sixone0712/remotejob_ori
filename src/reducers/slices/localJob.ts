import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabeledValue } from 'antd/lib/select';
import { RemoteNotificationState } from '../../types/remoteJob';
import { RootState } from '../rootReducer';
import { initialNotificationState } from './remoteJob';

interface LocalJobState {
  selectSite: LabeledValue | undefined;
  files: any;
  isErrorNotice: boolean;
  errorNotice: RemoteNotificationState;
  showAddr: boolean;
}

const initialState: LocalJobState = {
  selectSite: undefined,
  files: [],
  isErrorNotice: false,
  errorNotice: initialNotificationState('notice'),
  showAddr: false,
};

const locaJob = createSlice({
  name: 'localJob',
  initialState,
  reducers: {
    initLocalJob: () => initialState,
    setLocalJobInfoReducer: (state, action: PayloadAction<Partial<LocalJobState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    selectSite(state, action: PayloadAction<LabeledValue>) {
      state.selectSite = action.payload;
    },
    uploadFiles(state, action: PayloadAction<any>) {
      state.files = action.payload;
    },
    setLocalJobIsErrorNoticeReducer: (state, action: PayloadAction<boolean>) => {
      state.isErrorNotice = action.payload;
    },
    setLocalJobErrorNoticeReducer: (state, action: PayloadAction<Partial<RemoteNotificationState>>) => {
      return {
        ...state,
        errorNotice: {
          ...state.errorNotice,
          ...action.payload,
        },
      };
    },
    setLocalJobShowAddrReducer: (state, action: PayloadAction<boolean>) => {
      state.showAddr = action.payload;
    },
  },
});

export const {
  initLocalJob: initLocalJobAction,
  selectSite: selectSiteAction,
  uploadFiles: uploadFilesAction,
  setLocalJobInfoReducer,
  setLocalJobIsErrorNoticeReducer,
  setLocalJobErrorNoticeReducer,
  setLocalJobShowAddrReducer,
} = locaJob.actions;

export const localJobSiteSelector = (state: RootState): LocalJobState['selectSite'] => state.localJob.selectSite;
export const localJobFilesSelector = (state: RootState): LocalJobState['files'] => state.localJob.files;
export const localJobIsErrorNotice = (state: RootState): LocalJobState['isErrorNotice'] => state.localJob.isErrorNotice;
export const localJobErrorNotice = (state: RootState): LocalJobState['errorNotice'] => state.localJob.errorNotice;
export const localJobShowAddr = (state: RootState): LocalJobState['showAddr'] => state.localJob.showAddr;

export default locaJob.reducer;
