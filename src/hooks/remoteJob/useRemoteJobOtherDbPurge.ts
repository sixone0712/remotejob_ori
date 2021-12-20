import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { remoteEnableSetting, setRemoteJobInfoReducer } from '../../reducers/slices/remoteJob';

export default function useRemoteJobOtherDbPurge() {
  const dispatch = useDispatch();
  const enable = useSelector(remoteEnableSetting('dbPurge'));
  const [active, setActive] = useState(enable);

  const setEnable = useCallback(
    (e: CheckboxChangeEvent) => {
      setActive(e.target.checked);
      dispatch(
        setRemoteJobInfoReducer({
          isDbPurge: e.target.checked,
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
