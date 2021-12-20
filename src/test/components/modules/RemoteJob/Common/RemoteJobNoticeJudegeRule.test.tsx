import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobNoticeJudegeRule, {
  RemoteJobNoticeJudgeRuleProps,
} from '../../../../../components/modules/RemoteJob/Common/RemoteJobNoticeJudegeRule';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobNoticeJudgeRuleProps = {};
    const component = shallow(<RemoteJobNoticeJudegeRule {...input} />);
  });
});
