import { blue } from '@ant-design/colors';
import { LoadingOutlined, TagOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button, Modal, Timeline, Tooltip } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import useRemoteStatusSchedule from '../../../../hooks/jobStatus/useRemoteStatusSchedule';
import { RemoteJobTimeLine, RemoteJobTimeLineName } from '../../../../types/remoteJob';
import { BuildStatus } from '../../../../types/status';
import { V_SPACE } from '../../RemoteJob/Common/RemoteJobCommon';

export default function RemoteStatusSchedule(): JSX.Element {
  const {
    handleCancel,
    visible,
    data,
    isFetching,
    remove,
    scrollRef,
    scrollToCenterRef,
    scheduleInfo: { jobName, siteName },
    moveToHistory,
  } = useRemoteStatusSchedule();

  const [isDataChanged, setDataChanged] = useState(false);

  const timeInfo = useCallback(
    (item: RemoteJobTimeLine) => {
      return (
        <Timeline.Item color={convertColor(item.status)}>
          <span css={timeItemStyle(item.status)}>
            <span className="item-name" onClick={() => moveToHistory(item)}>
              {convertName(item.name)} ({convertStatus(item.status)})
            </span>
          </span>
          {item.isManual && (
            <Tooltip title="Manual Executed Job" placement="right">
              <TagOutlined style={{ marginLeft: '10px' }} />
            </Tooltip>
          )}
          <div css={timeStyle}>{convertTime(item.status, item.start, item.runningStart, item.end)}</div>
        </Timeline.Item>
      );
    },
    [moveToHistory]
  );

  const TimelineRender = useMemo(() => {
    if (!visible) {
      return undefined;
    }
    const findFirst = data?.findIndex((el) => el.status === 'processing' || el.status === 'notbuild') ?? -1;
    return data?.map((item, idx) => {
      const key = `${idx}-${item.name}`;
      if (findFirst === idx) {
        return (
          <div key={key} ref={scrollRef}>
            {timeInfo(item)}
          </div>
        );
      } else {
        return <div key={key}>{timeInfo(item)}</div>;
      }
    });
  }, [data, timeInfo, visible, scrollRef]);

  useEffect(() => {
    setDataChanged(true);
  }, [TimelineRender]);

  useLayoutEffect(() => {
    if (visible && !scrollToCenterRef.current && Boolean(scrollRef.current) && isDataChanged) {
      scrollRef.current?.scrollIntoView({ block: 'center' });
      scrollToCenterRef.current = true;
      setDataChanged(false);
    }
  }, [visible, isDataChanged]);

  useEffect(() => {
    if (!visible) {
      scrollToCenterRef.current = false;
      setDataChanged(false);
      remove();
    }
  }, [visible]);

  return (
    <>
      <Modal
        title="Job Schedule"
        visible={visible}
        onCancel={handleCancel}
        footer={
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        }
        destroyOnClose
      >
        <Badge text="Job Name" color="blue" style={{ marginRight: '67px' }} />
        <span>{jobName}</span>
        <V_SPACE />
        <Badge text="User-Fab Name" color="blue" style={{ marginRight: '30px' }} />
        <span>{siteName}</span>
        <V_SPACE />
        <Badge text="Schedule" color="blue" style={{ marginRight: '77px' }} />
        {isFetching && <LoadingOutlined style={{ color: 'blue' }} />}
        <div css={scheduleStyle}>
          <Timeline>
            <div>{TimelineRender}</div>
          </Timeline>
        </div>
      </Modal>
    </>
  );
}

const convertName = (name: RemoteJobTimeLineName) => {
  switch (name) {
    case 'collect':
      return 'Collect';
    case 'convert':
      return 'Convert & Insert';
    case 'error':
      return 'Error Summary';
    case 'cras':
      return 'Cras Data';
    case 'version':
      return 'MPA Version';
    case 'purge':
      return 'DB Purge';
    default:
      return name;
  }
};

const convertStatus = (status: BuildStatus) => {
  if (status === 'notbuild') {
    return 'Waiting';
  } else if (status === 'nodata') {
    return 'No Data';
  } else {
    return status.replace(/\b[a-z]/, (letter) => letter.toUpperCase());
  }
};

const convertColor = (status: BuildStatus) =>
  ({
    success: 'green',
    failure: 'red',
    processing: 'blue',
    notbuild: 'gray',
    nodata: 'green',
  }[status as string] ?? 'gray');

const convertTime = (status: BuildStatus, start: string, runningStart: string | undefined, end: string | undefined) => {
  let newStart = start;
  if (runningStart) {
    newStart = runningStart;
  }
  switch (status) {
    case 'notbuild':
      return newStart;
    case 'processing':
      return newStart + ' ~';
    default:
      return newStart + ' ~ ' + end;
  }
};

const scheduleStyle = css`
  overflow: auto;
  height: 500px;
  border: 1px solid lightgray;
  padding: 30px;
  margin-top: 10px;
`;

const timeStyle = css`
  color: #979494;
  margin-bottom: 0;
  font-size: 0.9em;
`;

const timeItemStyle = (status: BuildStatus) => css`
  ${status === 'success' || status === 'failure' || status === 'nodata'
    ? css`
        cursor: pointer;
        &:hover {
          color: ${blue[4]};
        }
        &:active {
          color: ${blue[6]};
        }
      `
    : css`
        cursor: not-allowed;
        .item-name {
          pointer-events: none;
        }
      `}
`;
