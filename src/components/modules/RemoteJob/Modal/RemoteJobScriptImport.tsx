import { InboxOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Modal, Space } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React from 'react';
import CustomIcon from '../../../atoms/CustomIcon';

export type RemoteJobScriptImportProps = {
  title: string;
  visible: boolean;
  importFile: File | undefined;
  setImportFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  handleOk: () => void;
  handleCancel: () => void;
};

export default React.memo(function RemoteJobScriptImport({
  title,
  visible,
  importFile,
  setImportFile,
  handleOk,
  handleCancel,
}: RemoteJobScriptImportProps): JSX.Element {
  const draggerProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    beforeUpload: (file: File) => {
      setImportFile(file);
      return false;
    },
    onRemove: () => {
      setImportFile(undefined);
    },
  };

  console.log('title', title);

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ disabled: !importFile }}
      onCancel={handleCancel}
      destroyOnClose // TODO: 다른 방법이 있을까???
    >
      <>
        <div css={warningStyle}>
          <Space>
            <CustomIcon name="warning" />
            <div>All saved script will be deleted and replaced</div>
          </Space>
          <div>with data from the Import script file.</div>
        </div>
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </>
    </Modal>
  );
});

const warningStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
`;
