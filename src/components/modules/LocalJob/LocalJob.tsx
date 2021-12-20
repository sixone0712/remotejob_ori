import { ControlOutlined, AppstoreOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Col, PageHeader, Row, Space } from 'antd';
import React, { useEffect } from 'react';
import useLocalJob from '../../../hooks/localJob/useLocalJob';
import CustomIcon from '../../atoms/CustomIcon';
import SideSteps from '../../atoms/SideSteps/SideSteps';
import StepButton from '../../atoms/StepButton';
import LocalConfigure from './LocalConfigure';
import LocalConfirm from './LocalConfirm';
import LocalJobOther from './LocalJobOther';

export type LocalJobProps = {};
export default function LocalJob(): JSX.Element {
  const { current, setCurrent, nextAction, onBack, initLocalJob } = useLocalJob();
  // disalbed Carousel
  // const carouselRef = useRef<any>();
  // const prevCurrent = useRef<number>(0);
  useEffect(() => {
    initLocalJob();
  }, []);

  // disalbed Carousel
  // useEffect(() => {
  //   if (prevCurrent.current < current) carouselRef.current.next();
  //   else if (prevCurrent.current > current) carouselRef.current.prev();
  //   prevCurrent.current = current;
  // }, [current]);

  return (
    <Container>
      <PageHeader onBack={onBack} title="Add Local Job Setting" />
      <Contents>
        <SideSteps current={current} stepList={localStepList} />
        <Settings>
          <SettingsTitle justify="space-between" align="middle">
            <Title current={current} />
            <StepButton
              current={current}
              setCurrent={setCurrent}
              lastStep={LOCAL_STEP.CONFIRM}
              nextAction={nextAction}
            />
          </SettingsTitle>
          <Main>
            {/* disalbed Carousel */}
            {/* <Carousel ref={carouselRef} dots={false}>
              <LocalConfigure />
              <LocalConfirm />
            </Carousel> */}
            {current === LOCAL_STEP.CONFIGURE && <LocalConfigure />}
            {current === LOCAL_STEP.OTHER_SETTING && <LocalJobOther />}
            {current >= LOCAL_STEP.CONFIRM && <LocalConfirm />}
          </Main>
        </Settings>
      </Contents>
    </Container>
  );
}

interface TitleProps {
  current: number;
}
function Title({ current }: TitleProps) {
  const { icon, text } = getTitle(current);

  return (
    <Space>
      {icon}
      <span>{text}</span>
    </Space>
  );
}

function getTitle(current: LOCAL_STEP) {
  switch (current) {
    case LOCAL_STEP.CONFIGURE:
      return {
        icon: <ControlOutlined />,
        text: 'Configure',
      };
    case LOCAL_STEP.OTHER_SETTING:
      return {
        icon: <AppstoreOutlined />,
        text: 'Other Setting',
      };
    case LOCAL_STEP.CONFIRM:
    default:
      return {
        icon: <CustomIcon name="check_setting" />,
        text: 'Check Settings',
      };
  }
}

const Container = styled(Row)`
  /* display: flex; */
  flex-direction: column;
  background-color: white;
  width: inherit;
`;

const Contents = styled(Row)`
  /* display: flex; */
  margin-left: 1.75rem;
  margin-right: 1.75rem;
  margin-top: 1.875rem;
  flex-wrap: nowrap;
  /* flex-direction: row; */
`;

const SettingsTitle = styled(Row)`
  margin-left: 1rem;
  font-size: 1.125rem;
`;

const Main = styled(Col)`
  padding-top: 2.125rem;
  margin-left: 3rem;
`;

const Settings = styled(Col)`
  /* margin-left: 11rem; */
  /* height: 28.125rem; */
  width: 67.1875rem;
`;

export enum LOCAL_STEP {
  CONFIGURE,
  OTHER_SETTING,
  CONFIRM,
}

export const localStepList = ['Configure', 'Other Setting', 'Confirm'];

export enum LOCAL_ERROR {
  NOT_SELECTED_SITE,
  NOT_UPLOADED_FILES,
  UPLOADING_FILES,
  NO_RECIPIENTS,
}
