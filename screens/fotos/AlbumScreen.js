import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';

import { setAlbumData } from '../../store/ducks/AlbumStore';
import SContainer from '../../components/Container';
import Layout from '../../constants/Layout';
import NavigationKeys from '../../constants/NavigationKeys';
import UtilFunctions from '../../util/UtilFunctions';
import SImage from '../../components/Image';
import SContent from '../../components/Content';
import SItem from '../../components/Item';
import SCard, { SCardItem } from '../../components/Card';
import SContentWithHeaderImage from '../../components/HeaderWithImage';
import Configs from '../../constants/Configs';
import SModal, { SModalDefaultProps } from '../../components/Modal';

const imageWidth = (Layout.width - 80) * 0.5 - 5; // 80 = 20 padding left and right in container and content; 0.5 = 50%; 5 = margin
const imageHeight = imageWidth * 0.5625; //16:9 aspact ratio

class AlbumScreen extends React.Component {
  constructor(props) {
    super(props);

    this.FullScreenImage = this.FullScreenImage.bind(this);

    this.album = this.props.navigation.getParam('album');
    this.images = (this.album.arquivos || []).map(arquivo => {
      return {
        source: {
          uri: UtilFunctions.getImageUrl(arquivo.imagem),
          // uri: 'http://wowslider.com/sliders/demo-81/data1/images/redkite50498.jpg',
          method: 'GET',
          headers: { Token: this.props.home.loginInfo.token }
        },
        style: { width: 200, height: 200 }
      }
    });
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <SContentWithHeaderImage
          headerTitle={this.album.album}
          headerSubtitle={this.images.length + ' fotos'}
          navigation={this.props.navigation}
          backgroundImage={(this.images[0] || { source: { uri: '' } }).source.uri}
          token={this.props.home.loginInfo.token}
          backTo={NavigationKeys.FOTOS}
        >
          <SCard preset="large" rounded additionalStyle={{ marginTop: -50, height: Layout.height - Configs.LARGE_HEADER.height }}>
            <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <SContent>
                <SItem style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {this.images.map((image, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={() => this.props.setAlbumData({ selectedImage: image })}>
                        <SImage {...image} style={{ width: imageWidth, height: imageHeight, marginBottom: 20 }} />
                      </TouchableOpacity>
                    );
                  })}
                </SItem>
              </SContent>
            </SCardItem>
          </SCard>
        </SContentWithHeaderImage>
        <this.FullScreenImage />
      </SContainer>
    );
  }

  FullScreenImage() {
    const width = Layout.width - 40;
    const height = width * 0.75;

    return (
      <SModal
        open={!!this.props.album.selectedImage}
        modalDidClose={() => this.props.setAlbumData({ selectedImage: null })}
        modalStyle={{ ...SModalDefaultProps.modalStyle, height: height, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}
      >
        <SImage
          source={(this.props.album.selectedImage || {}).source}
          style={{ width: '100%', height: '100%', ...Layout.midRounded, backgroundColor: 'transparent' }}
        />
      </SModal>
    );
  }
}

const mapStateToProps = state => {
  return { home: state.home, album: state.album };
};

const mapDispatchToProps = dispatch => {
  return {
    setAlbumData: data => dispatch(setAlbumData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumScreen);