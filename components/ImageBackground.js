import React from 'react';
import { ImageBackground } from "react-native";

export default function SImageBackground(props) {
  return <ImageBackground style={SImageBackgroundDefatulStyle} {...props} />;
}

export const SImageBackgroundDefatulStyle = {
  width: '100%',
  height: '100%'
};