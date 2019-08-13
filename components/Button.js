import React from 'react';
import { Button } from "native-base";
import Colors from '../constants/Colors';

export default function SButton(props) {
  return <Button {...props} style={{ ...(props.primaryColor ? { backgroundColor: Colors.systemBaseColor } : {}), ...props.style }} />;
}