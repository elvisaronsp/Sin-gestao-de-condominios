import React from 'react';
import { Item } from "native-base";

export default function SItem(props) {
  return <Item {...props} style={{ ...SItemDefaultStyle, ...props.style || {} }} />;
}

export const SItemDefaultStyle = {
  borderBottomWidth: 0,
  flexWrap: 'wrap'
};