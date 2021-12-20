import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobExcuteScript, {
  ExcuteScriptProps,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobExcuteScript';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ExcuteScriptProps = {
      name: 'collect',
    };
    const component = shallow(<RemoteJobExcuteScript {...input} />);
  });
});
