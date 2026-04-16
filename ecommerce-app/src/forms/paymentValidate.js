export const validatePayment = (values) => {
  const errors = {};

  // 1. Alias / Nombre del Banco (Coincide con 'bankName' en Mongoose)
  if (!values?.bankName?.trim() || values.bankName.trim().length < 3) {
    errors.bankName = "Escribe un nombre de banco o alias válido";
  }

  // 2. Número de tarjeta (Coincide con 'cardNumber' en Mongoose)
  const cleanCardNumber = values?.cardNumber?.toString().replace(/\s/g, "") || "";
  if (!cleanCardNumber || cleanCardNumber.length !== 16) {
    errors.cardNumber = "La tarjeta debe tener 16 dígitos";
  }

  // 3. Titular (Cambiado de 'placeHolder' a 'cardHolderName' para Mongoose)
  if (!values?.cardHolderName?.trim() || values.cardHolderName.trim().length < 3) {
    errors.cardHolderName = "Escribe el nombre del titular como aparece en la tarjeta";
  }

  // 4. Expiración (Cambiado de 'expireDate' a 'expiryDate' para Mongoose)
  if (!values?.expiryDate?.trim() || values.expiryDate.trim().length !== 5) {
    errors.expiryDate = "Usa el formato MM/AA";
  } else {
    const date = values.expiryDate.split("/");
    if (date.length !== 2) {
      errors.expiryDate = "Formato incorrecto";
    } else {
      const currentYear = Number(new Date().getFullYear().toString().slice(-2));
      const currentMonth = new Date().getMonth() + 1;
      
      const month = Number(date[0]);
      const year = Number(date[1]);

      if (month > 12 || month < 1) {
        errors.expiryDate = "Mes inválido (01-12)";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = "La tarjeta está expirada";
      }
    }
  }

  // 5. CVV (Nota: Tu modelo de Mongoose no tiene CVV, 
  // pero lo validamos para el proceso de pago)
  if (!values?.cvv?.trim() || (values.cvv.trim().length < 3 || values.cvv.trim().length > 4)) {
    errors.cvv = "CVV inválido (3 o 4 dígitos)";
  } else if (isNaN(values.cvv)) {
    errors.cvv = "Solo números";
  }

  return errors;
};