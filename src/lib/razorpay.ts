interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  amount,
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  keyId,
  onSuccess,
  onDismiss
}: {
  amount: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  keyId?: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}): Promise<void> => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
  }

  const options: RazorpayOptions = {
    key: keyId || 'rzp_test_BrijwasiDemoKey',
    amount: Math.round(amount * 100), // convert rupees to paise
    currency: 'INR',
    name: 'Brijwasi Pethe Wale',
    description: `Order ${orderNumber} - Authentic Agra Delicacies`,
    image: '/brijwasi-logo.jpg',
    handler: (response: RazorpayResponse) => {
      onSuccess(response.razorpay_payment_id);
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone
    },
    notes: {
      order_number: orderNumber
    },
    theme: {
      color: '#C21870' // Royal Magenta
    },
    modal: {
      ondismiss: onDismiss
    }
  };

  const rzpInstance = new window.Razorpay(options);
  rzpInstance.open();
};
