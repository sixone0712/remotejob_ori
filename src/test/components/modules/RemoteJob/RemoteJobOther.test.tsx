import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobOther, { RemoteJobOtherProps } from '../../../../components/modules/RemoteJob/RemoteJobOther';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobOtherProps = {};
    const component = shallow(<RemoteJobOther {...input} />);
  });
});
