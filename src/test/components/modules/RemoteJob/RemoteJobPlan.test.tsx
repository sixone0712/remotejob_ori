import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobPlan, { RemoteJobPlanProps } from '../../../../components/modules/RemoteJob/RemoteJobPlan';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobPlanProps = {
      type: 'add',
    };
    const component = shallow(<RemoteJobPlan {...input} />);
  });
});
