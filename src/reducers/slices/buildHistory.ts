import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildStatus, StatusStepType, StatusType } from '../../types/status';
import { RootState } from '../rootReducer';

export interface BuildHistorySelectedLogState {
  id: string | undefined;
  status: BuildStatus | undefined;
  name: string | undefined;
}

export interface BuildHistorySelectedJobState {
  jobId: string | undefined;
  type: StatusType | undefined;
  stepType: StatusStepType | undefined;
}

export interface BuildHistoryState {
  selectedJob: BuildHistorySelectedJobState | null;
  selectedLog: BuildHistorySelectedLogState | null;
  currentPage: number;
}

const initialState: BuildHistoryState = {
  selectedJob: null,
  selectedLog: null,
  currentPage: 1,
};

const buildHistory = createSlice({
  name: 'buildHistory',
  initialState,
  reducers: {
    initBuildHistory: () => initialState,
    setBuildHistory(state, action: PayloadAction<Partial<BuildHistoryState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setBuildHistorySelectedLog(state, action: PayloadAction<BuildHistorySelectedLogState | null>) {
      state.selectedLog = action.payload;
    },
    setBuildHistorySelectedJob(state, action: PayloadAction<BuildHistorySelectedJobState | null>) {
      state.selectedJob = action.payload;
    },
    setBuildHistoryCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  initBuildHistory,
  setBuildHistory,
  setBuildHistorySelectedLog,
  setBuildHistorySelectedJob,
  setBuildHistoryCurrentPage,
} = buildHistory.actions;

export const buildHistorySelectedJob = (state: RootState): BuildHistoryState['selectedJob'] =>
  state.buildHistory.selectedJob;
export const buildHistorySelectedLog = (state: RootState): BuildHistoryState['selectedLog'] =>
  state.buildHistory.selectedLog;

export const buildHistoryCurrentPage = (state: RootState): BuildHistoryState['currentPage'] =>
  state.buildHistory.currentPage;

export default buildHistory.reducer;
