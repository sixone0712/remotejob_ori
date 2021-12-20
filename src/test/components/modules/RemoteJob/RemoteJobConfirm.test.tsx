import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobConfirm, { RemoteJobConfirmProps } from '../../../../components/modules/RemoteJob/RemoteJobConfirm';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobConfirmProps = {};
    const component = shallow(<RemoteJobConfirm {...input} />);
  });
});
