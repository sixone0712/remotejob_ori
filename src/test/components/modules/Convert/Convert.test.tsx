import { shallow } from 'enzyme';
import React from 'react';
import Convert from '../../../../components/modules/Convert';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<Convert />);
  });
});
