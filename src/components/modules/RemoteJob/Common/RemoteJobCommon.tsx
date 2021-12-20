import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { RemoteJobName } from '../../../../types/remoteJob';

export const V_SPACE = styled.div`
  height: 1rem;
`;

export const H_SPACE = styled.div`
  width: 1rem;
`;

export const remoteJobCollapseStyle = (enable: boolean) => css`
  width: 61.5rem;
  cursor: ${!enable && 'not-allowed'};
  .ant-collapse-header {
    pointer-events: ${!enable && 'none'};
  }
`;

export const getRemoteJobTitleName = (name: RemoteJobName): string =>
  ({
    ['collect']: 'Collect',
    ['convert']: 'Convert & Insert',
    ['errorSummary']: 'Error Summary',
    ['crasData']: 'Cras Data',
    ['mpaVersion']: 'Mpa Version',
    ['dbPurge']: 'DB Purge',
    ['errorNotice']: 'Error Notice',
  }[name] ?? '');
