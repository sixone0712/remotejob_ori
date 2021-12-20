import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobCollectConvert, {
  RemoteJobCollectConvertProps,
} from '../../../../components/modules/RemoteJob/RemoteJobCollectConvert';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobCollectConvertProps = {};
    const component = shallow(<RemoteJobCollectConvert {...input} />);
  });
});
