import { Button } from '@alfalab/core-components/button/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import sparkles from '../assets/sparkles.png';
import { appSt } from '../style.css';
import { thxSt } from './style.css';

const link =
  'alfabank://multistep-route?fromModule=FORM&stepNumber=0&alias=invest-long-term-savings-open-alias&prefilledDataID=1001&version=2';

export const ThxLayout = () => {
  return (
    <>
      <div className={thxSt.container}>
        <img src={sparkles} width={80} height={80} className={thxSt.rocket} />
        <Typography.TitleResponsive style={{ margin: '24px 0 12px' }} font="system" tag="h1" view="small" weight="medium">
          Благодарим за участие!
        </Typography.TitleResponsive>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false} color="secondary">
          Мы проводим исследование. Вы только что помогли нам приблизиться к крутому результату!
        </Typography.Text>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
          Все операции отменены.
        </Typography.Text>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false} color="secondary">
          Условия сохраняются: Откройте счет ПДС и получите до <b style={{ color: '#000' }}>36%</b> по вкладу
        </Typography.Text>
      </div>
      <div className={appSt.bottomBtn()}>
        <Button
          block
          view="secondary"
          href={link}
          onClick={() => {
            window.gtag('event', '7106_open_pds_final_bundle', { var: 'var1' });
          }}
        >
          Открыть ПДС
        </Button>
      </div>
    </>
  );
};
