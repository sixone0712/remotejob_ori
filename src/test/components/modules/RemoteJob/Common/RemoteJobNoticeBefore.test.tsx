import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobNoticeBefore, {
  RemoteJobNoticeBeforeProps,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobNoticeBefore';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobNoticeBeforeProps = {
      name: 'crasData',
    };
    const component = shallow(<RemoteJobNoticeBefore {...input} />);
  });
});
