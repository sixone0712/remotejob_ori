import { EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button, Space } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useRemoteExcuteScript } from '../../../../hooks/remoteJob/useRemoteExcuteScript';
import { RemoteJobExcuteModeScriptName } from '../../../../types/remoteJob';
import RemoteJobScriptImport from '../Modal/RemoteJobScriptImport';
import RemoteJobScriptModal from '../Modal/RemoteJobScriptEdit';
import { getRemoteJobTitleName } from './RemoteJobCommon';

export type ExcuteScriptProps = {
  name: RemoteJobExcuteModeScriptName;
};

export default React.memo(function ExcuteScript({ name }: ExcuteScriptProps) {
  const {
    prevScript,
    nextScript,
    isEditPrev,
    isEditNext,
    setVisibleScriptPrev,
    setVisibleScriptNext,
    onChangePrevScript,
    onChangeNextScript,
    isImportPrev,
    isImportNext,
    setVisibleImportPrev,
    setVisibleImportNext,
    importFile,
    setImportFile,
    onChangePrevImportOk,
    onChangeNextImportOk,
    openExportModal,
  } = useRemoteExcuteScript({
    name,
  });

  const title = useCallback(
    ({ type, action }: { type: 'prev' | 'next'; action: 'edit' | 'import' }) => {
      const prefix = action === 'edit' ? 'Edit' : 'Import';
      const suffix = type === 'prev' ? 'Previous Script' : 'Next Script';
      const title = getRemoteJobTitleName(name);
      return `${prefix} ${title} ${suffix}`;
    },
    [name]
  );

  const ScriptButton = useMemo((): JSX.Element => {
    return (
      <>
        <Space className="previous">
          <div className="name">Previous</div>
          <Button type="dashed" icon={<EditOutlined />} onClick={() => setVisibleScriptPrev(true)}>
            Edit
          </Button>
          <Button type="dashed" icon={<ImportOutlined />} onClick={() => setVisibleImportPrev(true)}>
            Import
          </Button>
          <Button type="dashed" icon={<ExportOutlined />} onClick={() => openExportModal('prev')}>
            Export
          </Button>
        </Space>
        <Space className="next">
          <div className="name">Next</div>
          <Button type="dashed" icon={<EditOutlined />} onClick={() => setVisibleScriptNext(true)}>
            Edit
          </Button>
          <Button type="dashed" icon={<ImportOutlined />} onClick={() => setVisibleImportNext(true)}>
            Import
          </Button>
          <Button type="dashed" icon={<ExportOutlined />} onClick={() => openExportModal('next')}>
            Export
          </Button>
        </Space>
      </>
    );
  }, [setVisibleScriptPrev, setVisibleScriptNext, setVisibleImportPrev, setVisibleImportNext, openExportModal]);

  return (
    <div css={excuteScriptStyle}>
      <div className="script-title">
        <Badge color="blue" />
        <span>Script</span>
      </div>
      <div className="script-value">
        {ScriptButton}
        <RemoteJobScriptModal
          title={title({ type: 'prev', action: 'edit' })}
          visible={isEditPrev}
          setVisible={setVisibleScriptPrev}
          script={prevScript}
          onChangeScript={onChangePrevScript}
        />
        <RemoteJobScriptModal
          title={title({ type: 'next', action: 'edit' })}
          visible={isEditNext}
          setVisible={setVisibleScriptNext}
          script={nextScript}
          onChangeScript={onChangeNextScript}
        />
        <RemoteJobScriptImport
          title={title({ type: 'prev', action: 'import' })}
          visible={isImportPrev}
          importFile={importFile}
          setImportFile={setImportFile}
          handleOk={onChangePrevImportOk}
          handleCancel={() => setVisibleImportPrev(false)}
        />
        <RemoteJobScriptImport
          title={title({ type: 'next', action: 'import' })}
          visible={isImportNext}
          importFile={importFile}
          setImportFile={setImportFile}
          handleOk={onChangeNextImportOk}
          handleCancel={() => setVisibleImportNext(false)}
        />
      </div>
    </div>
  );
});

const excuteScriptStyle = css`
  display: flex;
  flex-direction: row;

  .script-title {
    width: 10rem;
  }

  .script-value {
    display: inherit;
    flex-direction: column;

    .name {
      width: 7rem;
    }

    .ant-btn {
      border-radius: 0.625rem;
    }

    .next {
      margin-top: 1rem;
    }
  }
`;
