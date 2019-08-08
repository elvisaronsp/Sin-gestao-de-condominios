import React from 'react';
import { Container } from "native-base";
import Colors from '../constants/Colors';

export default function SContainer(props) {
  return <Container {...props} style={{ backgroundColor: Colors.background, ...props.style || {} }} />;
}