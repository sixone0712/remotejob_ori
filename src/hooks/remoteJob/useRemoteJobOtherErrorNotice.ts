import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { remoteEnableSetting, setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';

export default function useRemoteJobOtherErrorNotice() {
  const dispatch = useDispatch();
  const enable = useSelector(remoteEnableSetting('errorNotice'));
  const [active, setActive] = useState(enable);

  const setEnable = useCallback(
    (e: CheckboxChangeEvent) => {
      setActive(e.target.checked);
      dispatch(
        setRemoteJobInfoReducer({
          isErrorNotice: e.target.checked,
        })
      );
    },
    [dispatch]
  );

  return {
    enable,
    setEnable,
    active,
    setActive,
  };
}
