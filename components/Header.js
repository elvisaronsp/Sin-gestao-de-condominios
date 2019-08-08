import React from 'react';
import { Header } from "native-base";
import Configs from '../constants/Configs';

export default function SHeader(props) {
  return <Header style={Configs.DEFAULT_HEADER} {...props} />;
}