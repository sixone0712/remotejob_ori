import {
  getRemoteJobTitleName,
  remoteJobCollapseStyle,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobCommon';

describe('renders the component', () => {
  it('calls correctly', () => {
    remoteJobCollapseStyle(true);
    getRemoteJobTitleName('collect');
  });
});
