import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce/lib';
import { searchAddressEmailAndGroup } from '../../lib/api/axios/requests';
import {
  remoteNoitceEmailState,
  setRemoteErrorNoticeReducer,
  setRemoteJobCrasDataReducer,
  setRemoteJobErrorSummaryReducer,
  setRemoteJobMpaVersionReducer,
  setRemoteShowAddrReducer,
} from '../../reducers/slices/remoteJob';
import { AddressOption } from '../../types/address';
import { RemoteJobNoticeName, RemoteNotificationState } from '../../types/remoteJob';

export default function useRemoteJobNoticeEmail({ name }: { name: RemoteJobNoticeName }) {
  const emailInfo = useSelector(remoteNoitceEmailState(name));
  const dispatch = useDispatch();
  const [subject, setSubject] = useState<string | undefined>('');
  const [body, setBody] = useState<string | undefined>('');
  const selectRef = useRef<any>(null);

  const setReducer = useCallback(
    (data: Partial<RemoteNotificationState>) => {
      if (name === 'errorSummary') {
        dispatch(setRemoteJobErrorSummaryReducer(data));
      } else if (name === 'crasData') {
        dispatch(setRemoteJobCrasDataReducer(data));
      } else if (name === 'mpaVersion') {
        dispatch(setRemoteJobMpaVersionReducer(data));
      } else if (name === 'errorNotice') {
        dispatch(setRemoteErrorNoticeReducer(data));
      }
    },
    [name, dispatch]
  );

  const debounceSubject = useDebouncedCallback(
    (subject: string) => {
      setReducer({
        subject,
      });
    },
    // delay in ms
    300
  );

  const debounceBody = useDebouncedCallback(
    (body: string) => {
      setReducer({
        body,
      });
    },
    // delay in ms
    300
  );

  const onChangeSubject = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSubject(e.target.value);
      debounceSubject(e.target.value);
    },
    [debounceSubject]
  );

  const onChangeBody = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setBody(e.target.value);
      debounceBody(e.target.value);
    },
    [debounceBody]
  );

  const deboundcedSearch = useDebouncedCallback((value: string, callback: any) => {
    if (!value) {
      callback([]);
    } else {
      searchAddressEmailAndGroup(value).then((res) => {
        const newList = res.map((item) => ({
          ...item,
          label: item.group ? `@${item.name}` : `${item.name} <${item.email}>`,
          value: `${item.id}`,
        }));
        callback(newList);
      });
    }
  }, 300);

  const onChangeSelectEmail = useCallback(
    (recipient: any) => {
      setReducer({
        recipient: recipient as AddressOption[],
      });
    },
    [setReducer]
  );

  const onCreateCustomEmail = useCallback(
    (value: string) => {
      const newRecipient: AddressOption = {
        id: 0,
        name: value,
        email: value,
        group: false,
        label: value,
        value: value,
      };

      setReducer({
        recipient: [...emailInfo.recipient, newRecipient],
      });
    },
    [setReducer, emailInfo.recipient]
  );

  const setVisibleAddr = useCallback(
    (visible: boolean) => {
      if (name === 'errorSummary') {
        dispatch(
          setRemoteShowAddrReducer({
            isErrorSummaryAddr: visible,
          })
        );
      } else if (name === 'crasData') {
        dispatch(
          setRemoteShowAddrReducer({
            isCrasDataAddr: visible,
          })
        );
      } else if (name === 'mpaVersion') {
        dispatch(
          setRemoteShowAddrReducer({
            isMpaVersionAddr: visible,
          })
        );
      } else if (name === 'errorNotice') {
        dispatch(
          setRemoteShowAddrReducer({
            isErrorNoticeAddr: visible,
          })
        );
      }
    },
    [dispatch, name]
  );

  const onSelectEscKeyPress = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') selectRef.current.blur();
  }, []);

  useEffect(() => {
    setSubject(emailInfo.subject ?? undefined);
    setBody(emailInfo.body ?? undefined);
  }, []);

  return {
    emailInfo,
    subject,
    body,
    onChangeSubject,
    onChangeBody,
    deboundcedSearch,
    onChangeSelectEmail,
    onCreateCustomEmail,
    setVisibleAddr,
    selectRef,
    onSelectEscKeyPress,
  };
}
