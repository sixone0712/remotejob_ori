import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobScriptImport, {
  RemoteJobScriptImportProps,
} from '../../../../../components/modules/RemoteJob/Modal/RemoteJobScriptImport';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobScriptImportProps = {
      title: 'test',
      visible: false,
      importFile: undefined,
      setImportFile: () => {},
      handleCancel: () => {},
      handleOk: () => {},
    };
    const component = shallow(<RemoteJobScriptImport {...input} />);
  });
});
