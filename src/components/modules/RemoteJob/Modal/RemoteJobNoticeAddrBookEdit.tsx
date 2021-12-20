import { Modal, Transfer } from 'antd';
import React from 'react';
import useRemoteJobNoticeAddrBookEdit from '../../../../hooks/remoteJob/useRemoteJobNoticeAddrBookEdit';
import { TransferJobAddressInfo } from '../../../../types/address';
import { RemoteJobNoticeName } from '../../../../types/remoteJob';

export type RemoteJobNoticeAddrBookEditProps = {
  name: RemoteJobNoticeName;
};
export default function RemoteJobNoticeAddrBookEdit({ name }: RemoteJobNoticeAddrBookEditProps): JSX.Element {
  const {
    visible,
    addressList,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  } = useRemoteJobNoticeAddrBookEdit({ name });

  const filterOption = (inputValue: string, item: TransferJobAddressInfo) =>
    item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
    item.email.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Modal
      title={'Address Book'}
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ disabled: isFetching }}
      onCancel={handleCancel}
      // cancelButtonProps={{
      //   disabled: isFetchingAddEdit,
      // }}
      // closable={!isFetchingAddEdit}
      // maskClosable={!isFetchingAddEdit}
      width={'1000px'}
    >
      <Transfer<TransferJobAddressInfo>
        dataSource={isFetching ? [] : addressList}
        titles={['All Emails', 'Recipients']}
        showSearch
        listStyle={{
          width: 500,
          height: 500,
        }}
        targetKeys={isFetching ? [] : targetKeys}
        onChange={handleChange}
        render={(item) => item.label}
        filterOption={filterOption}
        disabled={isFetching}
        onSelectChange={handleSelectChange}
        selectedKeys={selectedKeys}
      />
    </Modal>
  );
}
