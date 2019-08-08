import React from 'react';
import SText from './Text';
import Colors from '../constants/Colors';

export default function SErrorText({ text, visible = true }) {
  return visible && text ? <SText style={{ color: Colors.redHighlight, fontSize: 14, marginBottom: 5 }}>{text}</SText> : <SText style={{ display: 'none' }} />;
}