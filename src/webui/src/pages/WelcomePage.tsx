import React, { useEffect, useContext } from 'react';
import { Alert, Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

import { ThemeColorsContext } from '../context/themeColors';
import { CustomButton } from '../components/genericHOCs/CustomButton';
import { useCurrentUserActions } from '../hooks/useActions';

// ******************************************************************* //
// *** The only edits that need to be made to this file are to ******* //
// *** implement the action button that should be rendered after the * //
// *** user logs in (line 34), the titles (lines 57-58), and to ****** //
// *** update the refernce to the content that should be displayed *** //
// *** after the user logs in (line 83) ****************************** //
// ******************************************************************* //

interface WelcomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

const WelcomeMessage: React.FC<WelcomeProps> = (props) => {
  // Prepare to be able to send the user back to the catalog
  const navigate = useNavigate();

  let actionButton = null;
  if (props.isAuthenticated) {
    actionButton = (
      <CustomButton color="primary" onClick={() => navigate('/newTemplate')}>
        <h3>
          Get started creating a template!{' '}
          <i className="fa-solid fa-arrow-pointer fa-2xs"></i>
        </h3>
      </CustomButton>
    );
  } else {
    actionButton = (
      <CustomButton color="primary" onClick={props.authButtonMethod}>
        <h3>Click here to sign in</h3>
      </CustomButton>
    );
  }

  return (
    <Alert className="h-100 text-center" color="secondary" isOpen={true}>
      {/* HACK to force vertical alignment*/}
      <div style={{ paddingTop: 100 }}></div>
      <img src="sas-logo-midnight.png" height={60} alt={'SAS Logo'} />
      <h1>Welcome to the Dynamic Template Generator</h1>
      <h5>
        A SAS® prototype for dynamically generating deployable templates of
        cloud resources
      </h5>
      <br />
      <br />
      <br />
      {actionButton}
    </Alert>
  );
};

const WelcomeContent: React.FC<WelcomeProps> = (props) => {
  // Destructure out the action creators for this slice of the state store, already
  // bound to React-Redux's dispatch() function
  const { setUser } = useCurrentUserActions();

  const { info } = useContext(ThemeColorsContext);

  // Set the user from AAD into our Redux state store once they authenticate
  useEffect(() => {
    setUser(props.user);
  }, [props.isAuthenticated]);

  let contents = null;

  if (props.isAuthenticated) {
    const slideStyle = {
      borderRadius: 18,
      paddingRight: 20,
      paddingLeft: 20,
      alignItems: 'start',
      fontSize: 22,
      fontWeight: 'bold',
      backgroundColor: info,
      borderColor: 'black',
      color: 'white'
    };

    contents = (
      <Swiper
        id="main"
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Pagination]}
        pagination={{
          clickable: true,
          type: 'progressbar'
        }}
        style={{ width: 400 }}
      >
        <SwiperSlide style={slideStyle}>
          <div>
            <br />
            <br />
            <br />
            <h3>This app can help you save time!</h3>
            <br />
            <i className="fa-regular fa-clock fa-4x"></i>
            <br />
            <br />
            Save a few hundred clicks and by defining the cloud resources you
            need with a form
          </div>
        </SwiperSlide>
        <SwiperSlide style={slideStyle}>
          <div>
            <br />
            <br />
            <br />
            <h3>It will help determine what you need</h3>
            <br />
            <i className="fa-solid fa-box-open fa-4x"></i>
            <br />
            <br />
            This app will use the resources you request to determine additional
            resources that will be needed
          </div>
        </SwiperSlide>
        <SwiperSlide style={slideStyle}>
          <div>
            <br />
            <br />
            <br />
            <h3>All you have to do is deploy the generated template!</h3>
            <br />
            <i className="fa-regular fa-star fa-4x"></i>
            <br />
            <br />
            Get started with the button to your left!
          </div>
        </SwiperSlide>
      </Swiper>
    );
  } else {
    contents = <h3>Please sign in to continue</h3>;
  }

  return <div className="h-100 text-center">{contents}</div>;
};

export const WelcomePage: React.FC<WelcomeProps> = (props) => {
  let welcomeContent = null;
  if (props.isAuthenticated) {
    welcomeContent = (
      <Col style={{ padding: 40 }}>
        <WelcomeContent
          isAuthenticated={props.isAuthenticated}
          user={props.user}
          authButtonMethod={props.authButtonMethod}
        />
      </Col>
    );
  }
  return (
    <Container style={{ height: 700, padding: 20 }}>
      <Row className="h-100">
        <Col style={{ padding: 40 }}>
          <WelcomeMessage {...props} />
        </Col>
        {welcomeContent}
      </Row>
    </Container>
  );
};
