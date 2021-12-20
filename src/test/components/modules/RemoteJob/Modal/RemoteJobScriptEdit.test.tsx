import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobScriptEdit, {
  RemoteJobScriptEditProps,
} from '../../../../../components/modules/RemoteJob/Modal/RemoteJobScriptEdit';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobScriptEditProps = {
      title: 'test',
      visible: false,
      setVisible: (value: boolean) => {},
      script: null,
      onChangeScript: (value: string | null) => {},
    };

    const component = shallow(<RemoteJobScriptEdit {...input} />);
  });
});
