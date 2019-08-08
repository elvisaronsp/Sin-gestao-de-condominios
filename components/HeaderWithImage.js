import React from 'react';
import SContainer from './Container';
import SDefaultHeader from './DefaultHeader';
import Configs from '../constants/Configs';
import SImageBackground from './ImageBackground';
import Colors from '../constants/Colors';
import UtilFunctions from '../util/UtilFunctions';

export default function SContentWithHeaderImage({ children, navigation, headerTitle, headerSubtitle, backgroundImage, backTo, token }) {
  return (
    <SContainer>
      <SImageBackground
        source={{
          uri: UtilFunctions.getImageUrl(backgroundImage),
          method: 'GET',
          headers: {
            Token: token
          }
        }}
        style={{ width: '100%', height: Configs.EXTRA_LARGE_HEADER.height }}
      >
        <SDefaultHeader
          navigateProp={navigation.navigate}
          goTo={backTo}
          title={headerTitle}
          subtitle={headerSubtitle}
          style={{ ...Configs.EXTRA_LARGE_HEADER, backgroundColor: Colors.systemBaseColorRGBA(0.7) }}
        />
      </SImageBackground>
      {children}
    </SContainer>
  );
}