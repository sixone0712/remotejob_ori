import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobExcuteMode, {
  ExcuteModeProps,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobExcuteMode';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ExcuteModeProps = {
      name: 'collect',
    };
    const component = shallow(<RemoteJobExcuteMode {...input} />);
  });
});
