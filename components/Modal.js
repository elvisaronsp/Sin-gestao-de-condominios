import React from 'react';
import { StyleSheet, Keyboard } from 'react-native';

import Modal from 'react-native-simple-modal';

import Layout from '../constants/Layout';
import SItem from './Item';
import SText from './Text';
import Colors from '../constants/Colors';
import Infos from '../util/Infos';
import SButton from './Button';
import SIcon from './Icon';

export default class SModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initialOffset = this.getAdjustedOffset(Layout.height);
    this.state = { offset: this.initialOffset };
  }

  getAdjustedOffset(offset) {
    return offset + (this.props.extraOffset || 0);
  }

  componentDidMount() {
    this._mounted = true;
    Keyboard.addListener('keyboardDidShow', e => {
      if (this._mounted) {
        this.setState({ offset: this.getAdjustedOffset(0 - e.endCoordinates.height) });
      }
    });
    Keyboard.addListener('keyboardDidHide', () => {
      if (this._mounted) {
        this.setState({ offset: this.getAdjustedOffset(0) });
      }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }

  render() {
    return (
      <Modal
        {...SModalDefaultProps}
        offset={this.state.offset}
        {...this.props}
        modalDidOpen={() => this.setState({ offset: this.getAdjustedOffset(0) })}
        modalDidClose={() => {
          this.setState({ offset: this.initialOffset });
          this.props.modalDidClose();
        }}
      >
        <SItem style={styles.modalCloseButtonItem}>
          <SButton rounded style={styles.modalCloseButton} onPress={this.props.modalDidClose}>
            <SIcon style={styles.modalCloseButtonIcon} name="close" />
          </SButton>
        </SItem>
        {this.props.children}
      </Modal>
    );
  }
}

export function SModalTitle({ text, style = {}, textStyle = {} }) {
  return <SItem style={{ ...styles.modalTitle, ...style }}><SText style={{ ...styles.modalTitleText, ...textStyle }}>{text}</SText></SItem>;
}

export const SModalDefaultProps = {
  offset: 0,
  animationDuration: 200,
  animationTension: 40,
  closeOnTouchOutside: true,
  containerStyle: {
    justifyContent: "flex-end"
  },
  modalStyle: {
    ...Layout.midRounded,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    margin: 0,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    backgroundColor: Colors.whiteText,
    height: Layout.isSmallDevice ? '75%' : '60%'
  },
  overlayStyle: {
    backgroundColor: Colors.systemBaseColorRGBA(0.9),
    flex: 1
  }
};

const styles = StyleSheet.create({
  modalCloseButtonItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalCloseButton: {
    ...Infos.isIOS() ? {
      width: 40,
      height: 40
    } : {},
    marginTop: -70,
    backgroundColor: Colors.whiteText
  },
  modalCloseButtonIcon: {
    color: Colors.systemBaseColor
  },
  modalTitle: {
    marginTop: -20,
    marginBottom: 20,
    borderBottomWidth: 1
  },
  modalTitleText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 20,
    color: Colors.systemBaseColor
  }
});