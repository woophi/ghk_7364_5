import { LS, LSKeys } from '../ls';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (e: 'event', v: string, data?: Record<string, string>) => void;
  }
}

type Payload = {
  sum: number;
  product_type: 'Вклад' | 'ПДС';
};

export const sendDataToGA = async (payload: Payload) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      'https://script.google.com/macros/s/AKfycbySm6bwUac4E6BQUdo-4cjob-pelKcVMN6k_6ARwzoIOtRxgVXxHh4G9Qoptcb6Mqx0/exec',
      {
        redirect: 'follow',
        method: 'POST',
        body: JSON.stringify({ datetime: date, ...payload, variant: '7601_1', user_id: LS.getItem(LSKeys.UserId, 0) }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      },
    );
  } catch (error) {
    console.error('Error!', error);
  }
};
