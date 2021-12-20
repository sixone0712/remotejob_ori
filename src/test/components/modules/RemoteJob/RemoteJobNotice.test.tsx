import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobNotice, { RemoteJobNoticeProps } from '../../../../components/modules/RemoteJob/RemoteJobNotice';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobNoticeProps = {};
    const component = shallow(<RemoteJobNotice {...input} />);
  });
});
