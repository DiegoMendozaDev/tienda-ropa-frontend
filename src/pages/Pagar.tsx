import React, { useEffect, useRef } from 'react';

const PayPalButton: React.FC = () => {
  const paypalRef = useRef<HTMLDivElement>(null);
    function getCookieValue(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }
  const amount = getCookieValue("total"); // 💰 Precio fijo

  const handleSuccess = (details: any) => {
    console.log("Pago completado:", details);
    alert(`Gracias por tu compra, ${details.payer.name.given_name}`);
    // Aquí puedes enviar detalles al backend o redirigir al usuario
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=AZm-15b6HtQsgCapQRsLUCRYG3jzd_s6QpJ6Iuf74vUahKALk2EuNZfclIMPHR6SAA9fmAgrIlNA9jAO&currency=EUR`;
    script.async = true;

    script.onload = () => {
      if ((window as any).paypal && paypalRef.current) {
        (window as any).paypal.Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: amount }
              }]
            });
          },
          onApprove: async (_data: any, actions: any) => {
            const details = await actions.order.capture();
            handleSuccess(details);
          },
          onError: (err: any) => {
            console.error("Error con PayPal:", err);
          }
        }).render(paypalRef.current);
      }
    };

    document.body.appendChild(script);
  }, []);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
