import React from 'react';
import { Content } from "native-base";

export default function SContent(props) {
  return <Content enableAutomaticScroll={false} {...props} />;
}