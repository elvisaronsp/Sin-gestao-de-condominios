import { Dimensions } from 'react-native';
import Infos from '../util/Infos';
import Colors from './Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const bottomTabNavigatorHeight = 60;
const hardRounded = { borderRadius: 50 };
const littleShadow = {
  ...(Infos.isIOS() ? {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41
  } : { elevation: 2 }),
};
const midShadow = {
  ...(Infos.isIOS() ? {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  } : { elevation: 5 }),
};
const getHightlightStyle = function (color, width = 4) {
  return { backgroundColor: color, width: width, maxWidth: 4, height: '100 %' };
};

export default {
  window: {
    width,
    height
  },
  width,
  height,
  isSmallDevice: width < 375,
  content: {
    padding: 10,
    width,
    height
  },
  slightlyRounded: { borderRadius: 10 },
  midRounded: { borderRadius: 25 },
  hardRounded,
  centered: { alignItems: 'center', justifyContent: 'center' },
  bottomTabNavigatorHeight,
  contentMarginBottomInsideBottomTab: bottomTabNavigatorHeight + 5,
  littleShadow,
  midShadow,
  navigationNullHeader: {
    headerStyle: {
      height: 0
    },
    header: null
  },
  headerBodyStyle: {
    height: '100%',
    justifyContent: 'flex-start'
  },
  headerTitleStyle: {
    width: '100%',
    paddingTop: 10,
    textAlign: 'center',
    color: Colors.headerText,
    fontSize: 26,
    fontWeight: 'bold'
  },
  headerSubtitleStyle: {
    width: '100%',
    paddingTop: 5,
    textAlign: 'center',
    color: Colors.headerText,
    fontSize: 19
  },
  getHightlightStyle,
  scrollViewInsideModal: { marginBottom: 70 },
  typeButtonsItemHeight: 60,
  typeButtonsFontSize: 19,
  listItemDescriptionTextStyle: { color: Colors.systemBaseColor, fontSize: 16, fontWeight: 'bold' },
  inputLabel: { color: Colors.systemBaseColor, fontSize: 16, marginBottom: 5 },
  noLeftBody: { marginLeft: -20 },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.systemBaseColor,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    ...hardRounded
  },
  inputItem: { flexDirection: 'column', alignItems: 'flex-start' },
  ScreenCardLayoutTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.systemBaseColor, textAlign: 'center' },
  headerIconLeftRight: {
    width: 50,
    maxWidth: 50,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    ...(Infos.isIOS() ? { paddingLeft: 10, paddingRight: 10 } : { paddingTop: 5 })
  },
  headerButtonRight: { width: 50, height: 50, paddingRight: 5 },
  headerButtonLeft: { width: 50, height: 50 }
};
