import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localJobIsErrorNotice, setLocalJobIsErrorNoticeReducer } from '../../reducers/slices/localJob';

export default function useLocalJobOther() {
  const dispatch = useDispatch();
  const enable = useSelector(localJobIsErrorNotice);
  const [active, setActive] = useState(enable);

  const setEnable = useCallback(
    (e: CheckboxChangeEvent) => {
      setActive(e.target.checked);
      dispatch(setLocalJobIsErrorNoticeReducer(e.target.checked));
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
