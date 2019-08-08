import Validators from "./Validators";

function invalidLength(value, length) {
  return value.length !== 0 && value.length !== length;
}

function cpf(value = '', required = false) {
  let cpf = '';
  value = getCpfWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    cpf += value.charAt(i);
    if (value.charAt(i + 1)) {
      if (i === 2 || i === 5) {
        cpf += '.';
      } else if (i === 8) {
        cpf += '-';
      }
    }
  }

  const requiredError = required ? Validators.required(cpf).error : null;
  const invalidError = invalidLength(cpf, 14) ? 'CPF inválido' : null

  return {
    value: cpf,
    error: requiredError || invalidError
  };
}

function cnpj(value = '', required = false) {
  let cnpj = '';
  value = getCnpjWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    cnpj += value.charAt(i);
    if (value.charAt(i + 1)) {
      if (i === 1 || i === 4) {
        cnpj += '.';
      } else if (i === 7) {
        cnpj += '/';
      } else if (i === 11) {
        cnpj += '-';
      }
    }
  }

  const requiredError = required ? Validators.required(cnpj).error : null;
  const invalidError = invalidLength(cnpj, 18) ? 'CNPJ inválido' : null

  return {
    value: cnpj,
    error: requiredError || invalidError
  };
}

function cpfCnpj(value = '', required = false) {
  let val = getCpfCnpjWithJustNumbers(value);
  if (val.length <= 11) {
    return cpf(val, required);
  } else {
    return cnpj(val, required);
  }
}

function rg(value = '', required = false) {
  let rg = '';
  value = getRgWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    rg += value.charAt(i);
    if (value.charAt(i + 1)) {
      if (i === 1 || i === 4) {
        rg += '.';
      } else if (i === 7) {
        rg += '-';
      }
    }
  }

  const requiredError = required ? Validators.required(rg).error : null;
  const invalidError = invalidLength(rg, 12) ? 'RG inválido' : null

  return {
    value: rg,
    error: requiredError || invalidError
  };
}

function cep(value = '', required = false) {
  let cep = '';
  value = getCepWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    cep += value.charAt(i);
    if (value.charAt(i + 1)) {
      if (i === 1) {
        cep += '.';
      } else if (i === 4) {
        cep += '-';
      }
    }
  }

  const requiredError = required ? Validators.required(cep).error : null;
  const invalidError = invalidLength(cep, 10) ? 'RG inválido' : null

  return {
    value: cep,
    error: requiredError || invalidError
  };
}

function fone(value = '', required = false) {
  let fone = '';
  value = getFoneWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    fone += value.charAt(i);
    if (value.charAt(i + 1)) {
      if (i === 0) {
        fone = '(' + fone;
      } else if (i === 1) {
        fone += ') ';
      } else if ((value.length < 11 && i === 5) || (value.length === 11 && i === 6)) {
        fone += '-';
      }
    }
  }

  const requiredError = required ? Validators.required(fone).error : null;
  const invalidError = invalidLength(fone, 14) && invalidLength(fone, 15) ? 'Telefone inválido' : null

  return {
    value: fone,
    error: requiredError || invalidError
  };
}

function brDate(value, required = false) {
  let date = '';
  value = getBrDateWithJustNumbers(value);
  for (let i = 0; i < value.length; i++) {
    date += value.charAt(i);
    if (value.charAt(i + 1) && (i === 1 || i === 3)) {
      date += '/';
    }
  }

  const requiredError = required ? Validators.required(date).error : null;
  const invalidError = invalidLength(date, 14) && invalidLength(date, 15) ? 'Data inválida' : null

  return {
    value: date,
    error: requiredError || invalidError
  };
}

function getCpfWithJustNumbers(cpf = '') {
  return cpf.replace(/[\D]/g, '').substring(0, 11);
}

function getCnpjWithJustNumbers(cpf = '') {
  return cpf.replace(/[\D]/g, '').substring(0, 14);
}

function getCpfCnpjWithJustNumbers(cpfCnpj = '') {
  return cpfCnpj.replace(/[\D]/g, '').substring(0, 14);
}

function getRgWithJustNumbers(cpfCnpj = '') {
  return cpfCnpj.replace(/[\D]/g, '').substring(0, 9);
}

function getCepWithJustNumbers(cep = '') {
  return cep.replace(/[\D]/g, '').substring(0, 8);
}

function getFoneWithJustNumbers(cpf = '') {
  return cpf.replace(/[\D]/g, '').substring(0, 11);
}

function getBrDateWithJustNumbers(cpf = '') {
  return cpf.replace(/[\D]/g, '').substring(0, 8);
}

function number(value = '', required = false) {
  let number;
  if (typeof value === 'number') {
    number = value.toString();
  } else if (value == null) {
    number = '';
  } else {
    number = value;
  }
  number = number.replace(/[\D]/g, '');

  const requiredError = required ? Validators.required(number).error : null;
  const invalidError = null;

  return {
    value: number,
    error: requiredError || invalidError
  };
}

export default {
  cpf,
  cnpj,
  cpfCnpj,
  rg,
  cep,
  fone,
  brDate,
  getCpfWithJustNumbers,
  getCnpjWithJustNumbers,
  getCpfCnpjWithJustNumbers,
  getRgWithJustNumbers,
  getCepWithJustNumbers,
  getFoneWithJustNumbers,
  getBrDateWithJustNumbers,
  number
}