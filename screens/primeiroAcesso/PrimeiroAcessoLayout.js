import React from 'react';
import { StyleSheet } from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import SContainer from '../../components/Container';
import SView from '../../components/View';
import SText from '../../components/Text';
import SButton from '../../components/Button';
import SImageBackground from '../../components/ImageBackground';
import SItem from '../../components/Item';
import SIcon from '../../components/Icon';

export function PrimeiroAcessoLayout({ backgroundImage, title, subtitle, navigateProp, navigateTo, buttonText = 'Próximo', screenIndex }) {
  return (
    <SContainer>
      <SImageBackground source={backgroundImage}>
        <SView style={styles.view}>
          <SText style={styles.title}>{title}</SText>
          <SText style={styles.subtitle}>{subtitle}</SText>
          <SButton style={styles.button} rounded block onPress={() => navigateProp(navigateTo)}>
            <SText style={styles.buttonText}>{buttonText}</SText>
          </SButton>
          <SItem style={styles.indicatorItem}>
            <IndicatorIcon on={screenIndex === 0} />
            <IndicatorDash />
            <IndicatorDash />
            <IndicatorIcon on={screenIndex === 1} />
            <IndicatorDash />
            <IndicatorDash />
            <IndicatorIcon on={screenIndex === 2} />
          </SItem>
        </SView>
      </SImageBackground>
    </SContainer>
  );
}

function IndicatorIcon({ on }) {
  return <SIcon style={styles.indicatorIcon} name={on ? 'radio-button-on' : 'radio-button-off'} />;
}

function IndicatorDash() {
  return <SIcon style={styles.indicatorIcon} name="remove" />;
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    bottom: 10,
    ...Layout.centered
  },
  title: {
    textAlign: 'center',
    fontSize: 29,
    fontWeight: 'bold',
    color: Colors.whiteText
  },
  subtitle: {
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.whiteText
  },
  button: {
    height: 50,
    backgroundColor: Colors.white
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.systemBaseColor
  },
  indicatorItem: {
    flexDirection: 'row',
    ...Layout.centered
  },
  indicatorIcon: {
    paddingTop: 10,
    fontSize: 12,
    color: Colors.whiteText
  }
});