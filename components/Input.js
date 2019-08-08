import React from 'react';
import { Input } from "native-base";

export default class SInput extends React.Component {
  render() {
    return <Input {...this.props} ref={ref => this.props.getRef ? this.props.getRef(ref) : null} />;
  }
}