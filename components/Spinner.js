import React from 'react';
import { StyleSheet } from 'react-native';
import { Spinner } from 'native-base';

import SContainer from './Container';
import Colors from '../constants/Colors';
import SHttp from '../util/Http';

export const SSpinnerConstants = {
  HEADER_CONFIG: {
    ignoreSpinner: true
  }
};

export default class SSpinner extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { requestCount: 0 };
  }

  componentWillMount() {
    SHttp.interceptors.request.use(async options => {
      if (options.headers.ignoreSpinner) {
        delete options.headers.ignoreSpinner;
      } else {
        this.setState(oldState => {
          return { requestCount: oldState.requestCount + 1 };
        });
      }
      return options;
    })
    SHttp.interceptors.response.use(async data => {
      this.setState(oldState => {
        return { requestCount: oldState.requestCount < 1 ? 0 : oldState.requestCount - 1 };
      });
      return data;
    }, async err => {
      this.setState(oldState => {
        return { requestCount: oldState.requestCount < 1 ? 0 : oldState.requestCount - 1 };
      });
      return Promise.reject(err);
    });
  }

  render() {
    if (!this.state.requestCount) return <SContainer style={{ display: 'none' }} />
    return (
      <SContainer style={styles.container} >
        <Spinner color={Colors.white} />
      </SContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: Colors.systemBaseColor,
    opacity: 0.7,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});