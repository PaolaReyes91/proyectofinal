import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/Cart/CartView";
import PaymentList from "../components/Checkout/Payment/PaymentList";
import PaymentForm from "../components/Checkout/Payment/PaymentForm";
import SummarySection from "../components/Checkout/shared/SummarySection";
import { useCart } from "../context/CartContext";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentService.js";
import { createOrder } from "../services/orderService"; 
import Button from "../components/common/Button/Button";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import { normalizePayment } from "../utils/storageHelpers.js";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const suppressRedirect = useRef(false);

  // Estados locales
  const [payments, setPayments] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Lógica de costos (Cálculos para mostrar en UI)
  const subtotal = typeof total === "number" ? total : 0;
  const TAX_RATE = Number(process.env.REACT_APP_TAX_RATE) || 0.16;
  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const grandTotal = parseFloat((subtotal + taxAmount).toFixed(2));

  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v);

  // Carga inicial de métodos de pago
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingLocal(true);
      try {
        const payList = await getPaymentMethods();
        const normalized = (payList || []).map((p, i) => normalizePayment(p, i)).filter(Boolean);
        if (!isMounted) return;
        setPayments(normalized);
        const def = normalized.find(p => p.isDefault) || normalized[0] || null;
        setSelectedPayment(def);
        setPaymentSectionOpen(!def);
      } catch (err) {
        if (isMounted) setLocalError("Error al conectar con el servidor de pagos.");
      } finally {
        if (isMounted) setLoadingLocal(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Redirección si el carrito se vacía (protegida por useRef)
  useEffect(() => {
    if ((!cartItems || cartItems.length === 0) && !suppressRedirect.current) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // FUNCIÓN CLAVE: Guardar orden en MongoDB
  
  const handlePlaceOrder = async () => {
    if (!selectedPayment) return setLocalError("Selecciona un método de pago.");

    try { // <--- Aquí empieza el intento
      setIsProcessingOrder(true);
    
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedData?._id || storedData?.id;

    const savedOrder = await createOrder(
      cartItems, 
      userId, 
      selectedPayment._id || selectedPayment.id
    );

    if (savedOrder?._id) {
      suppressRedirect.current = true;
      clearCart();
      navigate("/order-confirmation", { state: { order: savedOrder } });
    }
  } catch (err) { // <--- ESTO ES LO QUE TE FALTA
    console.error("Error al crear la orden:", err);
    setLocalError(err.response?.data?.error || "Error al procesar pedido.");
  } finally { // <--- Opcional, pero recomendado para apagar el loading
    setIsProcessingOrder(false);
  }
};


  // Métodos de gestión de pagos (Siguen igual)
  const handlePaymentSubmit = async (formData) => {
    setLoadingLocal(true);
    try {
      const apiPayload = { ...formData, type: "credit_card", cardNumber: formData.cardNumber.replace(/\s/g, "") };
      const id = editingPayment?._id || editingPayment?.id;
      id ? await updatePaymentMethod(id, apiPayload) : await createPaymentMethod(apiPayload);
      
      const payList = await getPaymentMethods();
      const updated = (payList || []).map((p, i) => normalizePayment(p, i));
      setPayments(updated);
      setSelectedPayment(updated.find(p => p.isDefault) || updated[updated.length - 1]);
      setShowPaymentForm(false);
      setPaymentSectionOpen(false);
    } catch (err) {
      setLocalError("Error al guardar el método de pago.");
    } finally {
      setLoadingLocal(false);
    }
  };

  if (loadingLocal && payments.length === 0) return <Loading message="Cargando Checkout..." />;

  return (
    <div className="checkout-container">
      {localError && <ErrorMessage message={localError} />}
      
      <div className="checkout-left">
        <SummarySection
          title="1. Método de pago"
          selected={!!selectedPayment}
          isExpanded={showPaymentForm || paymentSectionOpen || !selectedPayment}
          onToggle={() => setPaymentSectionOpen(!paymentSectionOpen)}
          summaryContent={selectedPayment && (
            <div className="selected-payment">
              <p><strong>{selectedPayment.bankName || selectedPayment.alias}</strong></p>
              <p>**** {selectedPayment.cardNumber?.slice(-4)}</p>
            </div>
          )}
        >
          {!showPaymentForm ? (
            <PaymentList
              payments={payments}
              selectedPayment={selectedPayment}
              onSelect={(p) => { setSelectedPayment(p); setPaymentSectionOpen(false); }}
              onEdit={(p) => { setEditingPayment(p); setShowPaymentForm(true); }}
              onDelete={async (id) => {
                await deletePaymentMethod(id);
                const list = await getPaymentMethods();
                setPayments(list.map((p, i) => normalizePayment(p, i)));
              }}
              onAdd={() => { setEditingPayment(null); setShowPaymentForm(true); }}
            />
          ) : (
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              onCancel={() => setShowPaymentForm(false)}
              initialValues={editingPayment || {}}
              isEdit={!!editingPayment}
            />
          )}
        </SummarySection>

        <SummarySection title="2. Revisa tu pedido" selected={cartItems.length > 0} isExpanded={true}>
          <CartView />
        </SummarySection>
      </div>

      <div className="checkout-right">
        <div className="checkout-summary">
          <h3>Resumen de tu Orden</h3>
          <div className="summary-row"><span>Subtotal:</span><span>{formatMoney(subtotal)}</span></div>
          <div className="summary-row"><span>IVA (16%):</span><span>{formatMoney(taxAmount)}</span></div>
          <div className="summary-row total"><strong>Total:</strong><strong>{formatMoney(grandTotal)}</strong></div>
          
          <Button 
            className="checkout-pay-button"
            disabled={!selectedPayment || cartItems.length === 0 || isProcessingOrder}
            onClick={handlePlaceOrder}
          >
            {isProcessingOrder ? "Procesando..." : "Confirmar y Pagar"}
          </Button>
        </div>
      </div>
    </div>
  );
}