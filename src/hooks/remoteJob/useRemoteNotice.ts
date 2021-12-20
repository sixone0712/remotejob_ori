import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { remoteEnableSetting, setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';
import { RemoteJobNoticeName } from '../../types/remoteJob';

export function useRemoteNotice({ name }: { name: RemoteJobNoticeName }) {
  const dispatch = useDispatch();

  const enable = useSelector(remoteEnableSetting(name));

  const onChangeEnable = (e: CheckboxChangeEvent) => {
    if (name === 'errorSummary') {
      dispatch(
        setRemoteJobInfoReducer({
          isErrorSummary: e.target.checked,
        })
      );
    } else if (name === 'crasData') {
      dispatch(
        setRemoteJobInfoReducer({
          isCrasData: e.target.checked,
        })
      );
    } else if (name === 'mpaVersion') {
      dispatch(
        setRemoteJobInfoReducer({
          isMpaVersion: e.target.checked,
        })
      );
    } else if (name === 'errorNotice') {
      dispatch(
        setRemoteJobInfoReducer({
          isErrorNotice: e.target.checked,
        })
      );
    }
  };

  return {
    enable,
    onChangeEnable,
  };
}
