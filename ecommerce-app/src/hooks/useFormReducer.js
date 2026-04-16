import { useMemo, useReducer, useCallback, useEffect } from "react";

const FORM = {
  CHANGE: "FORM_CHANGE",
  BLUR: "FORM_BLUR",
  SET_ERRORS: "FORM_SET_ERRORS",
  MARK_TOUCHED: "FORM_MARK_TOUCHED",
  SUBMIT_START: "FORM_SUBMIT_START",
  SUBMIT_END: "FORM_SUBMIT_END",
  SET_SUBMIT_ERROR: "FORM_SET_SUBMIT_ERROR",
  RESET: "FORM_RESET",
};

// Utilidades para manejar objetos anidados (Deep Merge/Set)
function setIn(obj, path, value) {
  const keys = path.split(".");
  const clone = structuredClone(obj);
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

function getIn(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function formReducer(state, action) {
  switch (action.type) {
    case FORM.CHANGE: {
      const { name, value } = action.payload;
      return { 
        ...state, 
        values: setIn(state.values, name, value),
        // Limpiamos el error del campo al escribir
        errors: setIn(state.errors, name, undefined) 
      };
    }
    case FORM.BLUR: {
      const { name } = action.payload;
      return { ...state, touched: setIn(state.touched, name, true) };
    }
    case FORM.SET_ERRORS:
      return { ...state, errors: action.payload };
    case FORM.MARK_TOUCHED:
      return { ...state, touched: action.payload };
    case FORM.SUBMIT_START:
      return { ...state, isSubmitting: true, submitError: "" };
    case FORM.SUBMIT_END:
      return { ...state, isSubmitting: false };
    case FORM.SET_SUBMIT_ERROR:
      return { ...state, submitError: action.payload };
    case FORM.RESET:
      return action.payload; // El payload ya viene como el estado inicial completo
    default:
      return state;
  }
}

export function useFormReducer({ initialValues, validate }) {
  // Generamos el estado de "touched" inicial (todo en false)
  const initTouched = useCallback((obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v && typeof v === "object" && !Array.isArray(v)
          ? initTouched(v)
          : false,
      ]),
    ), []);

  const seed = useMemo(() => ({
    values: initialValues,
    touched: initTouched(initialValues),
    errors: {},
    isSubmitting: false,
    submitError: "",
  }), [initialValues, initTouched]);

  const [state, dispatch] = useReducer(formReducer, seed);

  // Sincronizar el estado si initialValues cambia (ej: de Editar a Nuevo)
  useEffect(() => {
    dispatch({ type: FORM.RESET, payload: seed });
  }, [seed]);

  const onChange = useCallback((e) => {
    // Soporte para eventos nativos y objetos personalizados {target: {name, value}}
    const target = e.target ? e.target : e;
    const { name, value, type, checked } = target;

    if (!name) return;

    const finalValue = type === "checkbox" ? checked : value;
    dispatch({ type: FORM.CHANGE, payload: { name, value: finalValue } });
  }, []);

  const onBlur = useCallback((e) => {
    const target = e.target ? e.target : e;
    const { name } = target;
    if (name) {
      dispatch({ type: FORM.BLUR, payload: { name } });
    }
  }, []);

  const runValidation = useCallback(() => {
    const errors = validate ? validate(state.values) : {};
    dispatch({ type: FORM.SET_ERRORS, payload: errors });
    return errors;
  }, [state.values, validate]);

  const getFieldError = (name) => getIn(state.errors, name);
  const isTouched = (name) => Boolean(getIn(state.touched, name));

  const markAllTouched = useCallback(() => {
    const mark = (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          v && typeof v === "object" && !Array.isArray(v) ? mark(v) : true,
        ]),
      );
    dispatch({ type: FORM.MARK_TOUCHED, payload: mark(state.values) });
  }, [state.values]);

  const handleSubmit = async (onSubmitCallback) => {
    markAllTouched();
    const errors = runValidation();

    if (Object.keys(errors).length === 0) {
      dispatch({ type: FORM.SUBMIT_START });
      try {
        await onSubmitCallback(state.values);
      } catch (error) {
        dispatch({ type: FORM.SET_SUBMIT_ERROR, payload: error.message });
      } finally {
        dispatch({ type: FORM.SUBMIT_END });
      }
    }
  };

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    onChange,
    onBlur,
    getFieldError,
    isTouched,
    handleSubmit,
    reset: () => dispatch({ type: FORM.RESET, payload: seed }),
    setValues: (newValues) => dispatch({ 
      type: FORM.RESET, 
      payload: { ...state, values: { ...state.values, ...newValues } } 
    }),
  };
}