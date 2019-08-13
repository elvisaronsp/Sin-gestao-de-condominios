import React from 'react';
import { List, ListItem } from "native-base";

export default function SList(props) {
  return <List {...props} />;
}

export function SListItem(props) {
  return <ListItem {...props} style={{ borderBottomWidth: 0, ...(props.style || {}) }} />;
}