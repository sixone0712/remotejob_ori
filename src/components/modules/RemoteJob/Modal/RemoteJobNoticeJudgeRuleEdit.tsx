import { Modal, Transfer } from 'antd';
import React from 'react';
import useRemoteJobNoticeJudgeRuleEdit from '../../../../hooks/remoteJob/useRemoteJobNoticeJudgeRuleEdit';
import { TransferRemoteJobJudgeRule } from '../../../../types/remoteJob';

export default function RemoteJobNoticeJudgeRuleEdit(): JSX.Element {
  const {
    visible,
    data,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  } = useRemoteJobNoticeJudgeRuleEdit();

  const filterOption = (inputValue: string, item: TransferRemoteJobJudgeRule) =>
    item.itemName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Modal
      title={'Edit Select Judge Rules'}
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
      <Transfer<TransferRemoteJobJudgeRule>
        dataSource={isFetching ? [] : data}
        titles={['All Enable Judge Rules', 'Selected Judge Rules']}
        showSearch
        listStyle={{
          width: 500,
          height: 500,
        }}
        targetKeys={isFetching ? [] : targetKeys}
        onChange={handleChange}
        render={(item) => item.itemName}
        filterOption={filterOption}
        disabled={isFetching}
        onSelectChange={handleSelectChange}
        selectedKeys={selectedKeys}
        
      />
    </Modal>
  );
}
