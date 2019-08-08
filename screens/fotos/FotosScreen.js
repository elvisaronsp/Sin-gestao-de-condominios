import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SContainer from '../../components/Container';
import SDefaultHeader from '../../components/DefaultHeader';
import { setFotosData } from '../../store/ducks/FotosStore';
import SContent from '../../components/Content';
import SList, { SListItem } from '../../components/List';
import SLeft from '../../components/Left';
import SBody from '../../components/Body';
import SRight from '../../components/Right';
import Layout from '../../constants/Layout';
import SIcon from '../../components/Icon';
import SText from '../../components/Text';
import Colors from '../../constants/Colors';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import UtilFunctions from '../../util/UtilFunctions';
import SImage from '../../components/Image';
import Configs from '../../constants/Configs';
import SCard, { SCardItem } from '../../components/Card';
import NavigationKeys from '../../constants/NavigationKeys';

class FotosScreen extends React.Component {
  constructor(props) {
    super(props);

    this.fetchFotos();
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <SDefaultHeader title="Fotos" navigateProp={this.props.navigation.navigate} />
        <SContent style={styles.mainContent}>
          <SCard preset="large" rounded>
            <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <SContent style={styles.cardItemConntent}>
                <SList>
                  {(this.props.fotos.albuns || []).map((album, index) => {
                    return (
                      <SListItem key={index} onPress={() => this.props.navigation.navigate(NavigationKeys.ALBUM, { album: album })}>
                        <SLeft style={Layout.isSmallDevice ? { maxWidth: 45 } : {}}>
                          <SImage source={{
                            uri: UtilFunctions.getImageUrl(((album.arquivos || [{}])[0] || {}).imagem),
                            method: 'GET',
                            headers: {
                              Token: this.props.home.loginInfo.token
                            }
                          }}
                            style={styles.listImagePreview}
                          />
                        </SLeft>
                        <SBody>
                          <SText style={styles.albumName}>{album.album}</SText>
                          <SText style={styles.albumQuantity}>{(album.arquivos || []).length} fotos</SText>
                        </SBody>
                        <SRight>
                          <SIcon name="arrow-forward" style={{ color: Colors.systemBaseColor }} />
                        </SRight>
                      </SListItem>
                    );
                  })}
                </SList>
              </SContent>
            </SCardItem>
          </SCard>
        </SContent >
      </SContainer>
    );
  }

  fetchFotos() {
    SHttp.get(Endpoints.FOTOS).then(
      response => this.props.setFotosData({ albuns: response.data.objeto }),
      err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível recuperar as fotos, tente novamente mais tarde!'))
    );
  }
}

const mapStateToProps = state => {
  return { home: state.home, fotos: state.fotos };
};

const mapDispatchToProps = dispatch => {
  return {
    setFotosData: data => dispatch(setFotosData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FotosScreen);

const styles = StyleSheet.create({
  mainContent: {
    marginTop: -50
  },
  listImagePreview: {
    width: Layout.isSmallDevice ? 40 : 100,
    height: Layout.isSmallDevice ? 40 : 100,
    ...Layout.slightlyRounded
  },
  albumName: {
    fontSize: Layout.isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: Colors.systemBaseColor
  },
  albumQuantity: {
    fontSize: Layout.isSmallDevice ? 14 : 16,
    color: Colors.darkGreyText
  },
  cardItemConntent: {
    maxHeight: Layout.height - Configs.DEFAULT_HEADER.height - 50
  }
});