import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { remoteEnableSetting, setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';
import { RemoteJobExcuteModeScriptName } from '../../types/remoteJob';

export function useRemoteCollectConvert({ name }: { name: RemoteJobExcuteModeScriptName }) {
  const dispatch = useDispatch();

  const enable = useSelector(remoteEnableSetting(name as 'convert'));

  const onChangeEnable = (e: CheckboxChangeEvent) => {
    if (name === 'convert') {
      dispatch(
        setRemoteJobInfoReducer({
          isConvert: e.target.checked,
        })
      );
    } else if (name === 'dbPurge') {
      dispatch(
        setRemoteJobInfoReducer({
          isDbPurge: e.target.checked,
        })
      );
    }
  };

  return {
    enable,
    onChangeEnable,
  };
}
