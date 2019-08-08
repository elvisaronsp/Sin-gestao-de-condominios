function none(value) {
  return {
    value: value,
    error: null
  };
}

function required(value) {
  return {
    value: value,
    error: value != null && value != '' && (typeof Value !== 'object' || value.length > 0) ? null : 'Este campo é obrigatório'
  };
}

function email(value = '', requiredField = false) {
  const val = value.trim();
  const requiredError = requiredField ? required(value).error : null;
  return {
    value: val,
    error: requiredError || typeof val === 'string' && val.indexOf('@') !== -1 ? null : 'E-mail inválido'
  };
}

function senhasIguais(value, valueToCompare, requiredField) {
  const requiredError = requiredField ? required(value).error : null;
  return {
    value: value,
    error: requiredError || value !== valueToCompare ? 'Senhas não conferem' : null
  };
}

export default {
  none,
  required,
  email,
  senhasIguais
};