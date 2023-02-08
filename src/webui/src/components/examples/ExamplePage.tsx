import React, { useState } from 'react';
import {
  Alert,
  Spinner,
  ButtonGroup,
  Tooltip,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardFooter
} from 'reactstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../../styles/basic-swiper.css';
import { CustomButton } from '../genericHOCs/CustomButton';
import { CustomBadge } from '../genericHOCs/CustomBadge';
import { hardcodedExampleCarouselItems } from './ExampleCarouselItems';

interface CarouselItem {
  name: string;
  body: any;
  footer: any;
  type: string;
}

interface CarouselProps {
  view: 'swiper' | 'layout';
}

const CarouselItem: React.FC<CarouselItem> = (props) => {
  return (
    <Card style={{ width: '25em' }}>
      <CardBody>
        <CardTitle tag="h3">{props.name}</CardTitle>
        <CardText>
          <CustomBadge color={props.type === 'Tip' ? 'info' : 'primary'}>
            {props.type}
          </CustomBadge>
          <br />
          <br />
          {props.body}
        </CardText>
      </CardBody>
      <CardFooter className="text-center">{props.footer}</CardFooter>
    </Card>
  );
};

// Map over all of the items in the array passed from Carousel and
// render content for each
function renderCarouselItems(
  CarouselItems: CarouselItem[],
  swiperView: 'swiper' | 'layout'
) {
  if (swiperView === 'swiper') {
    return (
      <div>
        {CarouselItems.map((item: CarouselItem, i: number) => (
          <SwiperSlide key={i}>
            <CarouselItem key={i} {...item} />
          </SwiperSlide>
        ))}
      </div>
    );
  } else if (swiperView === 'layout') {
    return CarouselItems.map((item: CarouselItem, i: number) => {
      return (
        <Col key={i} className="mt-4">
          <CarouselItem key={i} {...item} />
        </Col>
      );
    });
  }
}

const Carousel: React.FC<CarouselProps> = (props) => {
  // These are all being hardcoded as examples but its much more likely that they
  // would actually be implemented inside of a slide of Redux state which would hold
  // some items returned from an API call along with a loading flag
  //TODO: Implemented in a Slice of state? - ExampleCarouselItems returns components that retrieve data in different ways.
  const carouselItems: CarouselItem[] = hardcodedExampleCarouselItems;
  const carouselItemsLoading = false;

  if (carouselItemsLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Spinner className="m-auto" color="primary" />
      </div>
    );
  } else if (carouselItems.length === 0) {
    return (
      <Alert color="secondary">No carousel items meet this criteria</Alert>
    );
  } else {
    if (props.view === 'layout') {
      return (
        <div>
          <Container>
            <Row>{renderCarouselItems(carouselItems, 'layout')}</Row>
          </Container>
        </div>
      );
    } else {
      // Set up the main swiperJS component
      // https://swiperjs.com/react
      return (
        <div className="swiper-wrapper">
          <Swiper
            id="examplesSwiper"
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            // slidesPerView={'auto'} would work better if you don't
            // have more than one swiper in a single app
            slidesPerView={4}
          >
            {renderCarouselItems(carouselItems, 'swiper')}
          </Swiper>
        </div>
      );
    }
  }
};

const CarouselLayout: React.FC = () => {
  const [tableTooltipOpen, setTableTooltipOpen] = useState(false);
  const tableTooltipToggle = () => setTableTooltipOpen(!tableTooltipOpen);
  const [swiperTooltipOpen, setSwiperTooltipOpen] = useState(false);
  const swiperTooltipToggle = () => setSwiperTooltipOpen(!swiperTooltipOpen);
  // Set up local state to highlight the active button
  const [selectedView, setSelectedView] = useState<'swiper' | 'layout'>(
    'swiper'
  );

  const onSwiperViewClick = () => {
    setSelectedView('swiper');
  };

  const onLayoutViewClick = () => {
    setSelectedView('layout');
  };

  return (
    <div>
      {/* https://mdbootstrap.com/docs/react/layout/flexbox/ */}
      <div className="d-flex flex-row-reverse">
        {/* https://mdbootstrap.com/docs/react/utilities/spacing/ */}
        <ButtonGroup className="me-5">
          <CustomButton
            id="needsLayoutViewToolTip"
            className="p-2"
            color="secondary"
            outline
            onClick={onLayoutViewClick}
            active={selectedView === 'layout'}
          >
            <i className="fa-solid fa-table-cells-large"></i>
          </CustomButton>
          <Tooltip
            isOpen={tableTooltipOpen}
            target="needsLayoutViewToolTip"
            toggle={tableTooltipToggle}
          >
            View the catalog as a layout
          </Tooltip>
          <CustomButton
            id="needsSwiperViewToolTip"
            className="p-2"
            color="secondary"
            outline
            onClick={onSwiperViewClick}
            active={selectedView === 'swiper'}
          >
            <i className="fa-solid fa-forward"></i>
          </CustomButton>
          <Tooltip
            isOpen={swiperTooltipOpen}
            target="needsSwiperViewToolTip"
            toggle={swiperTooltipToggle}
          >
            View the catalog as a swiper
          </Tooltip>
        </ButtonGroup>
      </div>
      <br />
      <br />
      <Carousel view={selectedView} />
    </div>
  );
};

export const ExamplePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-center">Developer Tips & Ground Rules</h1>
      <h4 className="text-center">
        Contribution and usage guidance for Incubation & Rapid Prototyping team
        ReactJS frontend projects
      </h4>
      <p className="text-center">
        Check out the <b>hardcodedExampleCarouselItems</b> object at the top of
        the <b>src/webui/src/components/examples/ExamplePage.tsx</b>
        <br /> file to find the code behind each of the examples below
      </p>
      <CarouselLayout />
    </div>
  );
};
