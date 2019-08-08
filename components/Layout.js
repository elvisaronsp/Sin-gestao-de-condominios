import React from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';

export function SCol(props) {
  return <Col {...props} />;
}

export function SRow(props) {
  return <Row {...props} />;
}

export function SGrid(props) {
  return <Grid {...props} />;
}