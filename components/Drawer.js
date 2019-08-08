import React from 'react';
import { StyleSheet, Animated } from 'react-native';

import Colors from '../constants/Colors';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Layout from '../constants/Layout';
import SContainer from './Container';
import SList, { SListItem } from './List';
import SText from './Text';
import SLeft from './Left';
import SIcon from './Icon';
import SRight from './Right';
import Configs from '../constants/Configs';
import SButton from './Button';
import Infos from '../util/Infos';
import SContent from './Content';
import SBody from './Body';

const drawerWidth = Layout.width * 0.8;
const buttonCloseSize = 50;
const mainContentMarginTop = getStatusBarHeight() + 40;
const mainContentHeight = Layout.height - getStatusBarHeight() - 40 - 40;
const closeButtonCoordinates = {
  top: mainContentMarginTop - (buttonCloseSize / 2),
  right: Layout.width - drawerWidth - (buttonCloseSize / 2)
};
const initialX = drawerWidth * -1;
const initialButtonCloseX = drawerWidth;
const initialContainerPosition = 'relative';

export default class SDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: new Animated.Value(initialX),
      opacity: new Animated.Value(0),
      visibility: new Animated.Value(0),
      buttonCloseX: new Animated.Value(initialButtonCloseX),
      containerPosition: initialContainerPosition,
      display: 'none'
    };

    this.MenuItems = this.MenuItems.bind(this);
    this.animateOpen = this.animateOpen.bind(this);
    this.animateClose = this.animateClose.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.open && this.state.display === 'none') {
      this.animateOpen();
    } else if (!props.open && this.state.display === 'flex') {
      this.animateClose();
    }
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <SContainer style={{ ...styles.container, position: this.state.containerPosition, display: this.state.display }}>
        <Animated.View style={{ ...styles.backgroundMask, opacity: this.state.opacity }} />
        <Animated.View style={{ ...styles.mainContent, transform: [{ translateX: this.getTranslateX() }] }}>
          <SText style={styles.menuTitle}>{this.props.title}</SText>
          <this.MenuItems />
          <SText style={styles.footerText}>Icondev SIN - Versão {Infos.appVersion}</SText>
        </Animated.View>
        <Animated.View style={{ ...styles.closeButtonView, transform: [{ translateX: this.getTranslateButtonCloseX() }] }}>
          <SButton rounded style={styles.closeButton} onPress={() => this.closeMenu()}>
            <SIcon style={styles.closeButtonIcon} name="close" />
          </SButton>
        </Animated.View>
      </SContainer>
    );
  }

  MenuItems() {
    return (
      <SContent>
        <SList>
          {this.props.items.map(item => {
            return (
              <SListItem key={item.key} style={styles.listItem} onPress={() => this.onItemPress(item)}>
                <SLeft style={styles.listItemLeft}>
                  <SIcon style={styles.icon} name={item.params.iconName} />
                  <SText style={styles.itemText}>{item.key}</SText>
                </SLeft>
                <SRight>
                  <SIcon style={styles.icon} name="arrow-forward" />
                </SRight>
              </SListItem>
            );
          })}
        </SList>
      </SContent>
    );
  }

  getTranslateX() {
    return this.state.x.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
  }

  getTranslateButtonCloseX() {
    return this.state.buttonCloseX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
  }

  animateOpen() {
    Animated.parallel([
      Animated.timing(this.state.x, { toValue: 0, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.buttonCloseX, { toValue: 0, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.opacity, { toValue: 0.95, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.visibility, { toValue: 1, duration: Configs.ANIMATION_TIMING }).start()
    ]);
    if (this._mounted) {
      this.setState({ display: 'flex', containerPosition: 'absolute' });
    }
  }

  animateClose() {
    Animated.parallel([
      Animated.timing(this.state.x, { toValue: initialX, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.buttonCloseX, { toValue: initialButtonCloseX, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.opacity, { toValue: 0, duration: Configs.ANIMATION_TIMING }).start(),
      Animated.timing(this.state.visibility, { toValue: 0, duration: Configs.ANIMATION_TIMING }).start()
    ]);
    setTimeout(() => {
      if (this._mounted) {
        this.setState({ display: 'none', containerPosition: 'relative' });
      }
      this.props.onClose();
    }, Configs.ANIMATION_TIMING);
  }

  closeMenu() {
    this.animateClose();
  }

  onItemPress(item) {
    this.closeMenu();
    setTimeout(() => {
      this.props.onItemPress(item);
    }, Configs.ANIMATION_TIMING + 50);
  }
}

const menuTextColor = Colors.systemBaseColor;
const itemIconSize = 24;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  backgroundMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.systemBaseColor
  },
  mainContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: drawerWidth,
    height: mainContentHeight,
    marginTop: mainContentMarginTop,
    backgroundColor: Colors.cardBackground,
    padding: 10,
    ...Layout.midRounded,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    justifyContent: 'space-between'
  },
  closeButtonView: {
    position: 'absolute',
    top: closeButtonCoordinates.top,
    right: closeButtonCoordinates.right,
    backgroundColor: 'transparent'
  },
  closeButton: {
    backgroundColor: Colors.cardBackground,
    width: buttonCloseSize,
    height: buttonCloseSize,
    ...Layout.centered,
    ...Layout.littleShadow
  },
  closeButtonIcon: {
    color: menuTextColor,
    fontSize: 30
  },
  menuTitle: {
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: menuTextColor
  },
  listItem: {
    borderBottomWidth: 0,
    paddingRight: 0
  },
  listItemLeft: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  icon: {
    width: 30,
    fontSize: itemIconSize,
    color: menuTextColor
  },
  itemText: {
    paddingLeft: 10,
    fontSize: 20,
    color: menuTextColor
  },
  footerText: {
    marginTop: 10,
    paddingLeft: 10,
    color: Colors.darkGreyText,
    fontSize: 12
  }
});