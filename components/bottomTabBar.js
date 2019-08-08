import React, { Component } from 'react';
import { Animated } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Configs from '../constants/Configs';

const TAB_BAR_OFFSET = Layout.bottomTabNavigatorHeight * -1;

export default class SBottomTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(props) {
    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index];
    let newParams = newRoute.routes.find(route => route.params && route.params.bottomTabVisible === false);
    let isVisible = !newParams || !newParams.params || newParams.params.bottomTabVisible;
    isVisible = isVisible !== false;

    if (!isVisible) {
      Animated.timing(this.state.offset, { toValue: TAB_BAR_OFFSET, duration: Configs.ANIMATION_TIMING }).start();
    } else {
      Animated.timing(this.state.offset, { toValue: 0, duration: Configs.ANIMATION_TIMING }).start();
    }
  }

  hasVisibleParam(params) {
    return params && params.bottomTabVisible != undefined;
  }

  render() {
    return (
      <BottomTabBar {...this.props} style={{ ...styles.container, bottom: this.state.offset }} />
    );
  }
}

const styles = {
  container: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Layout.bottomTabNavigatorHeight,
    backgroundColor: Colors.cardBackground
  },
};