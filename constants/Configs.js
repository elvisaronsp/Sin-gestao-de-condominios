import Colors from "./Colors";
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Layout from "./Layout";

const TAB_TITLE = {
  headerTintColor: Colors.headerText,
  headerStyle: {
    backgroundColor: '#2f65bc'
  }
};

const DEFAULT_HEADER = {
  backgroundColor: Colors.systemBaseColor,
  paddingTop: getStatusBarHeight(),
  height: getStatusBarHeight() + 125
};

const LARGE_HEADER = {
  backgroundColor: Colors.systemBaseColor,
  paddingTop: getStatusBarHeight(),
  height: getStatusBarHeight() + 150
};

const EXTRA_LARGE_HEADER = {
  backgroundColor: Colors.systemBaseColor,
  paddingTop: getStatusBarHeight(),
  height: getStatusBarHeight() + 180
};

const CALENDAR_THEME = {
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: Colors.systemBaseColor,
  selectedDayTextColor: Colors.whiteText,
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: Colors.systemBaseColor,
  monthTextColor: Colors.systemBaseColor,
  textMonthFontWeight: 'bold',
  textDayFontSize: 16,
  textMonthFontSize: Layout.isSmallDevice ? 20 : 24,
  textDayHeaderFontSize: 18
};

export default {
  TAB_TITLE,
  DEFAULT_HEADER,
  LARGE_HEADER,
  EXTRA_LARGE_HEADER,
  CALENDAR_THEME,
  ANIMATION_TIMING: 350,
  toastSuccess: {
    type: 'success',
    buttonText: 'OK',
    buttonTextStyle: { fontWeight: 'bold' },
    duration: 2500
  },
  toastError: {
    type: 'danger',
    buttonText: 'OK',
    buttonTextStyle: { fontWeight: 'bold' },
    duration: 4000
  },
  toastWarning: {
    type: 'warning',
    buttonText: 'OK',
    buttonTextStyle: { fontWeight: 'bold' },
    duration: 4000
  }
}