import React from 'react';

import SContainer from './Container';
import SDefaultHeader from './DefaultHeader';
import SContent from './Content';
import SCard, { SCardItem } from './Card';
import Configs from '../constants/Configs';
import Layout from '../constants/Layout';

export default function ScreenCardLayout({
  navigateProp, headerTitle, headerSubtitle, headerGoTo, headerStyle, headerRightComponent,
  contentStyle, contentMarginTop, contentCardPreset, extraCardItemContentHeight, cardItemContentStyle, contentEnableAutomaticScroll,
  noBottomTab, refreshControl, titleComponent, children
}) {
  return (
    <SContainer>
      <SDefaultHeader
        navigateProp={navigateProp}
        title={headerTitle}
        goTo={headerGoTo}
        subtitle={headerSubtitle}
        style={headerStyle}
        rightComponent={headerRightComponent}
      />
      <SContent enableAutomaticScroll={contentEnableAutomaticScroll} style={contentStyle || { marginTop: contentMarginTop || -50 }}>
        <SCard preset={contentCardPreset || 'large'} rounded>
          {titleComponent}
          <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
            <SContent
              style={cardItemContentStyle || getDefaultCardItemContentStyle(headerStyle, noBottomTab, extraCardItemContentHeight)}
              refreshControl={refreshControl}
            >
              {children}
            </SContent>
          </SCardItem>
        </SCard>
      </SContent>
    </SContainer >
  );
}

function getDefaultCardItemContentStyle(headerStyle, noBottomTab, extraHeight) {
  let maxHeight = Layout.height;
  maxHeight -= headerStyle && headerStyle.height ? headerStyle.height : Configs.DEFAULT_HEADER.height;
  maxHeight -= noBottomTab ? 0 : Layout.contentMarginBottomInsideBottomTab;
  maxHeight -= noBottomTab ? 40 : 20;
  maxHeight += extraHeight || 0;

  return { maxHeight };
}