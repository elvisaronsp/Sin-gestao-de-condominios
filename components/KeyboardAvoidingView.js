import React from 'react';
import { KeyboardAvoidingView } from "react-native";

export default function SKeyboardAvoidingView(props) {
  return <KeyboardAvoidingView behavior="padding" style={{ width: '100%', height: '100%' }} {...props} />;
}