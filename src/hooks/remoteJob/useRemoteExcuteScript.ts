import { Modal } from 'antd';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRemoteJobTitleName } from '../../components/modules/RemoteJob/Common/RemoteJobCommon';
import {
  remoteExcuteState,
  remoteShowScript,
  remoteShowScriptImport,
  setRemoteJobCollectScriptReducer,
  setRemoteJobConvertScriptReducer,
  setRemoteJobCrasDataScriptReducer,
  setRemoteJobDbPurgeScriptReducer,
  setRemoteJobErrorSummaryScriptReducer,
  setRemoteJobMpaVersionScriptReducer,
  setRemoteShowScriptImportReducer,
  setRemoteShowScriptReducer,
} from '../../reducers/slices/remoteJob';
import { RemoteJobExcuteModeScriptName, RemoteJobExcuteState } from '../../types/remoteJob';

export function useRemoteExcuteScript({ name }: { name: RemoteJobExcuteModeScriptName }) {
  const dispatch = useDispatch();
  const {
    script: { previous: prevScript, next: nextScript },
  } = useSelector(remoteExcuteState(name));
  const { isPrev: isEditPrev, isNext: isEditNext } = useSelector(remoteShowScript(name));
  const { isPrev: isImportPrev, isNext: isImportNext } = useSelector(remoteShowScriptImport(name));
  const [importFile, setImportFile] = useState<File | undefined>(undefined);

  const setScriptReducer = useCallback(
    (data: Partial<RemoteJobExcuteState['script']>) => {
      if (name === 'collect') {
        dispatch(setRemoteJobCollectScriptReducer(data));
      } else if (name === 'convert') {
        dispatch(setRemoteJobConvertScriptReducer(data));
      } else if (name === 'errorSummary') {
        dispatch(setRemoteJobErrorSummaryScriptReducer(data));
      } else if (name === 'crasData') {
        dispatch(setRemoteJobCrasDataScriptReducer(data));
      } else if (name === 'mpaVersion') {
        dispatch(setRemoteJobMpaVersionScriptReducer(data));
      } else if (name === 'dbPurge') {
        dispatch(setRemoteJobDbPurgeScriptReducer(data));
      }
    },
    [name, dispatch]
  );

  const onChangePrevScript = useCallback(
    (previous: string | null) => {
      setScriptReducer({
        previous,
      });
    },
    [setScriptReducer]
  );

  const onChangeNextScript = useCallback(
    (next: string | null) => {
      setScriptReducer({
        next,
      });
    },
    [setScriptReducer]
  );

  const setVisible = useCallback(
    ({ key, value, reducer }: { key: 'prev' | 'next'; value: boolean; reducer: any }) => {
      if (name === 'collect') {
        dispatch(key === 'prev' ? reducer({ isCollectPrev: value }) : reducer({ isCollectNext: value }));
      } else if (name === 'convert') {
        dispatch(key === 'prev' ? reducer({ isConvertPrev: value }) : reducer({ isConvertNext: value }));
      } else if (name === 'errorSummary') {
        dispatch(key === 'prev' ? reducer({ isErrorSummaryPrev: value }) : reducer({ isErrorSummaryNext: value }));
      } else if (name === 'crasData') {
        dispatch(key === 'prev' ? reducer({ isCrasDataPrev: value }) : reducer({ isCrasDataNext: value }));
      } else if (name === 'mpaVersion') {
        dispatch(key === 'prev' ? reducer({ isMpaVersionPrev: value }) : reducer({ isMpaVersionNext: value }));
      } else if (name === 'dbPurge') {
        dispatch(key === 'prev' ? reducer({ isDbPurgePrev: value }) : reducer({ isDbPurgeNext: value }));
      }
    },
    [name, dispatch]
  );

  const setVisibleScriptPrev = useCallback(
    (value: boolean) => {
      setVisible({ key: 'prev', value, reducer: setRemoteShowScriptReducer });
    },
    [setVisible]
  );

  const setVisibleScriptNext = useCallback(
    (value: boolean) => {
      setVisible({ key: 'next', value, reducer: setRemoteShowScriptReducer });
    },
    [setVisible]
  );

  const setVisibleImportPrev = useCallback(
    (value: boolean) => {
      setVisible({ key: 'prev', value, reducer: setRemoteShowScriptImportReducer });
    },
    [setVisible]
  );

  const setVisibleImportNext = useCallback(
    (value: boolean) => {
      setVisible({ key: 'next', value, reducer: setRemoteShowScriptImportReducer });
    },
    [setVisible]
  );

  const onChangePrevImportOk = useCallback(() => {
    if (importFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setScriptReducer({ previous: fileReader.result as string });
        setVisibleImportPrev(false);
      };
      fileReader.readAsText(importFile);
    } else {
      setVisibleImportPrev(false);
    }
  }, [importFile, setVisibleImportPrev, setScriptReducer]);

  const onChangeNextImportOk = useCallback(() => {
    if (importFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setScriptReducer({ next: fileReader.result as string });
        setVisibleImportNext(false);
      };
      fileReader.readAsText(importFile);
    } else {
      setVisibleImportNext(false);
    }
  }, [importFile, setVisibleImportNext, setScriptReducer]);

  useEffect(() => {
    if (isImportPrev || isImportNext) {
      setImportFile(undefined);
    }
  }, [isImportPrev, isImportNext]);

  const openExportModal = useCallback(
    (type: 'prev' | 'next') => {
      const titleUpper = getRemoteJobTitleName(name);
      const typeUpper = type === 'prev' ? 'Previous' : 'Next';
      const titleLower = titleUpper.toLowerCase();
      const typeLower = typeUpper.toLowerCase();
      const script = type === 'prev' ? prevScript : nextScript;

      const confirm = Modal.confirm({
        className: `export-${typeLower}-${titleLower}`,
        title: `Export ${typeUpper} ${titleUpper} Script `,
        content: `Are you sure to export ${typeLower} ${titleLower} script?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const blob = new Blob([script ?? ''], { type: 'text/plain', endings: 'transparent' });
            saveAs(blob, `${typeLower}_${titleLower.replace('& ', '').replace(' ', '_')}.py`);
          } catch (e) {
            console.error(e);
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
    [prevScript, nextScript, name]
  );

  return {
    prevScript,
    nextScript,
    isEditPrev,
    isEditNext,
    setVisibleScriptPrev,
    setVisibleScriptNext,
    onChangePrevScript,
    onChangeNextScript,
    isImportPrev,
    isImportNext,
    setVisibleImportPrev,
    setVisibleImportNext,
    importFile,
    setImportFile,
    onChangePrevImportOk,
    onChangeNextImportOk,
    openExportModal,
  };
}
