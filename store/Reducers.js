import { combineReducers } from "redux";
import loginReducer from "./ducks/LoginStore";
import homeReducer from "./ducks/HomeStore";
import boletosReducer from "./ducks/BoletosStore";
import reservasReducer from "./ducks/ReservasStore";
import adicionarReservaReducer from "./ducks/AdicionarReservaStore";
import minhaReservaReducer from "./ducks/MinhaReservaStore";
import perfilReducer from "./ducks/PerfilStore";
import fotosReducer from "./ducks/FotosStore";
import albumReducer from "./ducks/AlbumStore";
import avisosReducer from "./ducks/AvisosStore";
import alterarSenhaReducer from "./ducks/AlterarSenhaStore";

const reducers = combineReducers({
  login: loginReducer,
  home: homeReducer,
  boletos: boletosReducer,
  reservas: reservasReducer,
  adicionarReserva: adicionarReservaReducer,
  minhaReserva: minhaReservaReducer,
  perfil: perfilReducer,
  fotos: fotosReducer,
  album: albumReducer,
  avisos: avisosReducer,
  alterarSenha: alterarSenhaReducer
});

export default reducers;