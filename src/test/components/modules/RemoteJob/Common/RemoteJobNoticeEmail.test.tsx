import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobNoticeEmail, {
  RemoteJobNoticeEmailProps,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobNoticeEmail';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobNoticeEmailProps = {
      name: 'crasData',
    };
    const component = shallow(<RemoteJobNoticeEmail {...input} />);
  });
});
