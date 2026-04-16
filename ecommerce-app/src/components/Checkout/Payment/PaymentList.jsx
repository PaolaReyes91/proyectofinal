import Button from '../../common/Button/Button';
import PaymentItem from "./PaymentItem";
import "./PaymentList.css";

const PaymentList = ({
  payments,
  selectedPayment,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="payment-list">
      <div className="payment-list-header">
        <h3>Métodos de Pago</h3>
        <Button onClick={onAdd}>Agregar Nueva Tarjeta</Button>
      </div>
      <div className="payment-list-content">
        {payments && payments.length > 0 ? (
        payments.map((payment, index) => (
          <PaymentItem
            key={payment._id || payment.id || `pay-${index}`} 
            payment={payment}
            isSelected={selectedPayment?._id === payment._id || selectedPayment?.id === payment.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="muted">No tienes métodos de pago guardados.</p>
      )}
      </div>
    </div>
  );
};

export default PaymentList;