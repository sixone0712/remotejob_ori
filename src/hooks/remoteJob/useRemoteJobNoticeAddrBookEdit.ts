import { TransferDirection } from 'antd/lib/transfer';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressGroupEmailList } from '../../lib/api/axios/requests';
import { AddressInfo } from '../../lib/api/axios/types';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import {
  remoteNoitceEmailState,
  remoteShowAddr,
  setRemoteErrorNoticeReducer,
  setRemoteJobCrasDataReducer,
  setRemoteJobErrorSummaryReducer,
  setRemoteJobMpaVersionReducer,
  setRemoteShowAddrReducer,
} from '../../reducers/slices/remoteJob';
import { AddressOption, TransferJobAddressInfo } from '../../types/address';
import { RemoteJobNoticeName, RemoteNotificationState } from '../../types/remoteJob';

export default function useRemoteJobNoticeAddrBookEdit({ name }: { name: RemoteJobNoticeName }) {
  const { recipient } = useSelector(remoteNoitceEmailState(name));
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<AddressOption[]>([]);
  const visible = useSelector(remoteShowAddr(name));
  const dispatch = useDispatch();

  const { data, isFetching } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_GROUPS_EMAILS],
    () => getAddressGroupEmailList(),
    {
      enabled: visible,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of group and email!`, error);
      },
    }
  );

  const addressList: TransferJobAddressInfo[] = useMemo(
    () =>
      data?.map((item: AddressInfo) => {
        const { name, group, id, email } = item;
        return {
          key: id.toString(),
          ...item,
          label: group ? `@${name}` : `${name} <${email}>`,
          value: id.toString(),
        };
      }) ?? [],
    [data]
  );

  const setRecipient = useCallback(
    (recipient: AddressOption[]) => {
      if (name === 'errorSummary') {
        dispatch(
          setRemoteJobErrorSummaryReducer({
            recipient,
          })
        );
      } else if (name === 'crasData') {
        dispatch(
          setRemoteJobCrasDataReducer({
            recipient,
          })
        );
      } else if (name === 'mpaVersion') {
        dispatch(
          setRemoteJobMpaVersionReducer({
            recipient,
          })
        );
      } else if (name === 'errorNotice') {
        dispatch(
          setRemoteErrorNoticeReducer({
            recipient,
          })
        );
      }
    },
    [dispatch, name]
  );

  const setVisible = useCallback(
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

  const handleOk = useCallback(() => {
    const groupTags: AddressOption[] = [];
    const emailTags: AddressOption[] = [];
    targetKeys?.map((item) => {
      const foundItem = addressList.find((innerItem) => innerItem.id === +item);
      if (foundItem) {
        const { id, name, email, group, label, value } = foundItem;
        if (foundItem.group) {
          groupTags.push({ id, name, email, group, label, value });
        } else {
          emailTags.push({ id, name, email, group, label, value });
        }
      }
    });

    setRecipient([...groupTags, ...emailTags, ...customEmails]);
    setVisible(false);
  }, [setRecipient, setVisible, addressList, targetKeys, customEmails]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleChange = useCallback((targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
  }, []);

  const handleSelectChange = useCallback((sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }, []);

  useEffect(() => {
    if (visible) {
      const groups = recipient.filter((item) => item.group).map((item) => item.value);
      const emails = recipient.filter((item) => !item.group && item.id).map((item) => item.value);
      const custom = recipient.filter((item) => !item.group && !item.id);

      setTargetKeys([...groups, ...emails]);
      setCustomEmails(custom);
    } else {
      setTargetKeys([]);
      setCustomEmails([]);
    }
  }, [visible]);

  return {
    visible,
    addressList,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  };
}
