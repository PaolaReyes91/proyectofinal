import { useMemo } from "react";
import Button from "../../common/Button/Button";
import Input from "../../common/Input";
import { useFormReducer } from "../../../hooks/useFormReducer";
import { paymentInitialValues } from "../../../forms/paymentModel";
import { validatePayment } from "../../../forms/paymentValidate";
import "./PaymentForm.css";

const paymentFields = [
  {
    id: "bankName",
    label: "Alias / Banco:",
    name: "bankName",
    placeHolder: "Nombre para identificar tu tarjeta",
    autocomplete: "cc-name",
  },
  {
    id: "cardNumber",
    label: "Número de la tarjeta:",
    name: "cardNumber",
    placeHolder: "5444 0000 0000 0000",
    autocomplete: "cc-number",
  },
  {
    id: "cardHolderName",
    label: "Nombre del titular:",
    name: "cardHolderName", // <--- DEBE COINCIDIR CON EL MODELO
    placeHolder: "Como aparece en la tarjeta",
    autocomplete: "cc-name",
  },
  {
    id: "expiryDate", // ANTES: expireDate
    label: "Fecha de expiración:",
    name: "expiryDate", // <--- DEBE COINCIDIR CON EL MODELO (con 'y')
    placeHolder: "MM/AA",
    autocomplete: "cc-exp",
  },
  {
    id: "cvv",
    label: "CVV:",
    name: "cvv",
    type: "password",
    maxLength: 4,
    autocomplete: "cc-csc",
  },
];

const PaymentForm = ({
  onSubmit,
  onCancel,
  initialValues = {},
  isEdit = false,
}) => {
  // Combinamos valores iniciales por defecto con los que vienen por props (si es edición)
  const mergedInitial = useMemo(
    () => ({ ...paymentInitialValues, ...initialValues }),
    [initialValues]
  );

  const { 
    values, 
    onChange, 
    onBlur, 
    handleSubmit, 
    getFieldError, 
    isTouched, 
    isSubmitting, 
    submitError 
  } = useFormReducer({
    initialValues: mergedInitial,
    validate: validatePayment,
  });

    const onFormSubmit = (e) => {
      e.preventDefault();
    
    // 1. Ejecutamos la validación manualmente para ver qué hay mal
      const validationErrors = validatePayment(values);
        console.log("Errores detectados por el validador:", validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        console.warn("El formulario no se envió porque tiene errores.");
      }

      handleSubmit((formValues) => {
        console.log("¡Éxito! Enviando al servidor...");
        onSubmit(formValues);
      });
  };

  return (
    <form 
      className="payment-form" 
      noValidate 
      onSubmit={onFormSubmit}
      // La key ayuda a resetear el componente visualmente si cambias de edición a nuevo
      key={isEdit ? initialValues._id : "new-form"}
    >
      <h3>{isEdit ? "Editar Método de Pago" : "Nuevo Método de Pago"}</h3>

      <div className="payment-form-grid">
        {paymentFields.map((field) => (
          <Input
            key={field.id}
            id={field.id}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeHolder}
            autoComplete={field.autocomplete}
            maxLength={field.maxLength}
            value={values[field.name] ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            error={getFieldError(field.name)}
            showError={isTouched(field.name)}
          />
        ))}
      </div>

      <div className="form-checkbox">
        <input
          type="checkbox"
          name="isDefault" // Cambiado a isDefault para coincidir con tu lógica de Checkout
          checked={!!values.isDefault}
          onChange={onChange}
          id="defaultPayment"
        />
        <label htmlFor="defaultPayment">
          Establecer como método de pago predeterminado
        </label>
      </div>

      {submitError && <p className="error-message">{submitError}</p>}

      <div className="form-actions">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="primary"
        >
          {isSubmitting
            ? "Guardando..."
            : isEdit
              ? "Actualizar Tarjeta"
              : "Guardar Tarjeta"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default PaymentForm;