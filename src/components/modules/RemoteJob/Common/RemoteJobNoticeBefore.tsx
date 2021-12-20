import React, { useCallback } from 'react';
import { css } from '@emotion/react';
import { RemoteJobNoticeName } from '../../../../types/remoteJob';
import { Badge, InputNumber } from 'antd';
import { EMAIL_BEFORE_MAX } from '../../../../lib/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  remoteNoitceBeforeState,
  setRemoteJobCrasDataReducer,
  setRemoteJobErrorSummaryReducer,
  setRemoteJobMpaVersionReducer,
} from '../../../../reducers/slices/remoteJob';
import { H_SPACE } from './RemoteJobCommon';

export type RemoteJobNoticeBeforeProps = {
  name: RemoteJobNoticeName;
};

export default React.memo(function RemoteJobNoticeBefore({ name }: RemoteJobNoticeBeforeProps): JSX.Element {
  const { before } = useSelector(remoteNoitceBeforeState(name));
  const dispatch = useDispatch();

  const onChangeBefore = useCallback(
    (before: number) => {
      const data = {
        before,
      };

      if (name === 'errorSummary') {
        dispatch(setRemoteJobErrorSummaryReducer(data));
      } else if (name === 'crasData') {
        dispatch(setRemoteJobCrasDataReducer(data));
      } else if (name === 'mpaVersion') {
        dispatch(setRemoteJobMpaVersionReducer(data));
      }
    },
    [dispatch, name]
  );

  return (
    <div css={style}>
      <div className="before">
        <div className="before-title">
          <Badge color="blue" />
          <span>Before</span>
        </div>
        <div className="before-value">
          <InputNumber
            min={1}
            max={EMAIL_BEFORE_MAX}
            value={before}
            onChange={onChangeBefore}
            formatter={(value) => {
              return value ? JSON.stringify(Math.floor(value)) : '';
            }}
          />
          <H_SPACE />
          <div>Day</div>
        </div>
      </div>
    </div>
  );
});

const style = css`
  display: flex;
  flex-direction: row;

  .before {
    display: flex;
    .before-title {
      width: 10rem;
    }
    .before-value {
      display: flex;
      align-items: center;
    }
  }
`;
