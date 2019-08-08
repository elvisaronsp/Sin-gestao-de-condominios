import React from 'react';
import { Image } from "react-native";
import Colors from '../constants/Colors';

// const defaultImage = require('../assets/images/image-loading.png');

export default function SImage(props) {
  return <Image
    resizeMode="cover"
    progressiveRenderingEnabled={true}
    // defaultSource={defaultImage}
    {...props}
    style={{ backgroundColor: Colors.cardBackground, ...props.style }}
  />;
}