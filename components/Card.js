import React from 'react';
import { Card, CardItem } from "native-base";
import Layout from '../constants/Layout';

export default function SCard(props) {
  return <Card {...getPreset(props)} {...props} />;
}

export function SCardItem(props) {
  return <CardItem {...props} />;
}

function getPreset(props) {
  const preset = props.preset;
  let presetObj = { style: {} };

  if (preset === 'large') {
    presetObj.style.width = Layout.width - 40;
    presetObj.style.marginLeft = 20;
    presetObj.style.padding = 20;
  }
  if (props.rounded) {
    presetObj.style.borderRadius = Layout.midRounded.borderRadius;
  }
  presetObj.style = { ...presetObj.style, ...(props.additionalStyle || {}) }
  return presetObj;
}