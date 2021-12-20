import { PaperClipOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Col, Row, Space } from 'antd';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useLocalJobSlices from '../../../hooks/localJob/useLocalJobSlices';
import useUploadFiles from '../../../hooks/useUploadFiles';
import { localJobErrorNotice, localJobIsErrorNotice } from '../../../reducers/slices/localJob';
import PopupTip from '../../atoms/PopupTip';

export type LocalConfirmProps = {};
export default function LocalConfirm(): JSX.Element {
  const { selectSite } = useLocalJobSlices();
  const { responseFiles } = useUploadFiles();
  const { recipient } = useSelector(localJobErrorNotice);
  const isErrorNotice = useSelector(localJobIsErrorNotice);

  const doneFileslen = useMemo(() => responseFiles.filter((item) => item.status === 'done').length, [responseFiles]);

  return (
    <>
      <SiteName align="middle">
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>User-Fab Name</span>
        </Space>
        <SelectedSite>{selectSite?.label}</SelectedSite>
      </SiteName>
      <FileUpload align="top">
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>Files</span>
        </Space>
        <UploadFiles>
          <UploadFileCount>{doneFileslen} Files</UploadFileCount>
          {responseFiles.map((item) => (
            <UploadFileList key={item.uid}>
              <div css={loadFileStyle(item.status)}>
                <PaperClipOutlined className="icon" />
                <span title={item.name} className="text">{`${item.name} ${
                  item.status === 'error' ? '(Error)' : ''
                }`}</span>
              </div>
            </UploadFileList>
          ))}
        </UploadFiles>
      </FileUpload>
      <OtherSetting>
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>Other Settings</span>
        </Space>
        <ErrorNotice>
          <div className="title">Error Notice</div>
          <div className="value">
            {!isErrorNotice ? (
              'None'
            ) : recipient.length > 0 ? (
              <div>
                <PopupTip
                  value={`${recipient.length} Recipients`}
                  list={recipient.map((item) => item.label as string)}
                  placement="right"
                  color="blue"
                />
              </div>
            ) : (
              <div>{`${recipient.length} Recipients`}</div>
            )}
          </div>
        </ErrorNotice>
      </OtherSetting>
    </>
  );
}

const SiteName = styled(Row)`
  font-size: 1rem;
  flex-wrap: nowrap;
`;

const FileUpload = styled(Row)`
  font-size: 1rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
`;

const OtherSetting = styled(Row)`
  font-size: 1rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
`;

const ErrorNotice = styled.div`
  display: flex;
  .title {
    width: 12rem;
  }
`;

const SelectedSite = styled(Col)``;
const UploadFiles = styled(Col)``;
const UploadFileCount = styled(Row)``;
const UploadFileList = styled(Row)`
  margin-left: 0.5rem;
`;

const spaceStyle = css`
  min-width: 13.25rem;
`;

const loadFileStyle = (status: string | undefined) => css`
  .icon {
    margin-right: 0.5rem;
    color: rgba(0, 0, 0, 0.45);
  }
  .text {
    color: ${status === 'error' && 'red'};
    text-decoration-line: ${status === 'error' && 'line-through'};
    width: 49rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  display: flex;
  align-items: center;
`;
