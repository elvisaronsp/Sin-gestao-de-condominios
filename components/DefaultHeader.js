import React from 'react';
import SHeader from './Header';
import SBody from './Body';
import SText from './Text';
import SLeft from './Left';
import SButton from './Button';
import SIcon from './Icon';
import Configs from '../constants/Configs';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import NavigationKeys from '../constants/NavigationKeys';
import SRight from './Right';

export default function SDefaultHeader({ navigateProp, goTo, title, subtitle, style, rightComponent, allowNavigate = true }) {
  return (
    <SHeader style={{ ...Configs.DEFAULT_HEADER, ...style }}>
      <BackToHomeInHeader navigateProp={navigateProp} goTo={goTo} allowNavigate={allowNavigate} />
      <SBody style={Layout.headerBodyStyle}>
        <SText style={Layout.headerTitleStyle}>{title}</SText>
        <SText style={Layout.headerSubtitleStyle}>{subtitle}</SText>
      </SBody>
      <SRight style={Layout.headerIconLeftRight}>
        {rightComponent}
      </SRight>
    </SHeader>
  );
}

function BackToHomeInHeader({ navigateProp, goTo, allowNavigate }) {
  return (
    <SLeft style={Layout.headerIconLeftRight}>
      <SButton
        transparent
        rounded
        style={{ ...Layout.headerButtonLeft, ...(allowNavigate ? {} : { display: 'none' }) }}
        onPress={() => navigateProp(goTo || NavigationKeys.HOME)}
      >
        <SIcon style={{ color: Colors.whiteText }} name="arrow-back" />
      </SButton>
    </SLeft>
  );
}