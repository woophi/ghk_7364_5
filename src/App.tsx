import { AmountInput } from '@alfalab/core-components/amount-input/cssm';
import { Button } from '@alfalab/core-components/button/cssm';
import { Collapse } from '@alfalab/core-components/collapse/cssm';
import { Divider } from '@alfalab/core-components/divider/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { SuperEllipse } from '@alfalab/core-components/icon-view/cssm/super-ellipse';
import { PureCell } from '@alfalab/core-components/pure-cell/cssm';
import { Spinner } from '@alfalab/core-components/spinner/cssm';
import { Steps } from '@alfalab/core-components/steps/cssm';
import { Tag } from '@alfalab/core-components/tag/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { BanknotesMIcon } from '@alfalab/icons-glyph/BanknotesMIcon';
import { CategoryCommisionMIcon } from '@alfalab/icons-glyph/CategoryCommisionMIcon';
import { CategoryInvoiceMIcon } from '@alfalab/icons-glyph/CategoryInvoiceMIcon';
import { CheckmarkMIcon } from '@alfalab/icons-glyph/CheckmarkMIcon';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ChevronUpMIcon } from '@alfalab/icons-glyph/ChevronUpMIcon';
import { GiftBoxMIcon } from '@alfalab/icons-glyph/GiftBoxMIcon';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import hbImg from './assets/hb.png';
import moneyImg from './assets/money.png';
import rubIcon from './assets/rub.png';
import sl1 from './assets/sl_1.png';
import sl2 from './assets/sl_2.png';
import sl3 from './assets/sl_3.png';
import sl4 from './assets/sl_4.png';
import { useTimeout } from './hooks/useTimeout';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { ThxLayout } from './thx/ThxLayout';
import {
  calcIncomeByMonths,
  calculateInvestmentIncome,
  calculateStateSupport,
  calculateTaxRefund,
  randomDocNumber,
  randomEmailRu,
  randomOtpCode,
} from './utils/calc';
import { sendDataToGA } from './utils/events';
import { round } from './utils/round';

const impItems = [
  {
    title: '36% годовых',
    subtitle: 'Ставка по вкладу с ПДС на 1 месяц',
    Icon: CategoryCommisionMIcon,
  },
  {
    title: '60 000 ₽',
    subtitle: 'Минимальная сумма вклада',
    Icon: BanknotesMIcon,
  },
  {
    title: 'До 1 680 000 ₽',
    subtitle: 'Бонусы по ПДС от государства',
    Icon: GiftBoxMIcon,
  },
  {
    title: 'Без пополнения и без снятия',
    subtitle: 'Условия по вкладу',
    Icon: CategoryInvoiceMIcon,
  },
];

const pdsSlides = [
  {
    img: sl1,
    title: 'До 360 000 ₽',
    subtitle: 'Бонус от государства за 10 лет',
  },
  {
    img: sl2,
    title: 'До 1 320 000 ₽',
    subtitle: 'Налоговый вычет за 15 лет',
  },
  {
    img: sl3,
    title: '21,56% годовых',
    subtitle: 'Инвестиционный доход за 2024 год',
  },
  {
    img: sl4,
    title: 'Деньги застрахованы',
    subtitle: 'До 2,8 млн ₽ в Агентстве по страхованию вкладов',
  },
];

const hiw = [
  {
    title: 'Откройте ПДС в приложении',
    desc: 'На сумму от 60 000 ₽ — это ваш первый взнос в программу',
  },
  {
    title: 'Откройте Альфа‑Вклад',
    desc: 'С программой долгосрочных сбережений на сумму не более первого взноса в ПДС',
  },
  {
    title: 'Получайте больше дохода',
    desc: 'По вкладу с повышенной ставкой и от инвестиций в ПДС',
  },
];

const faqs = [
  {
    question: 'На какой срок открывается ПДС?',
    answers: [
      'ПДС открывается на 15 лет или до достижения установленного возраста:',
      '55 лет — для женщин',
      '60 лет — для мужчин',
    ],
  },
  {
    question: 'Сколько лет действует софинансирование от государства?',
    answers: ['Софинансирование от государства предоставляется в течение 10 лет с момента начала участия в программе'],
  },
  {
    question: 'Как начисляются проценты по вкладу?',
    answers: [
      'Проценты начисляются ежемесячно и капитализируются — каждый месяц они прибавляются к сумме вклада, и в следующем месяце доход начисляется уже на увеличенную сумму',
    ],
  },
  {
    question: 'Кому доступна повышенная ставка по вкладу?',
    answers: [
      'Повышенная ставка доступна клиентам, которые впервые открывают ПДС. Оформить можно только один вклад с повышенной ставкой',
    ],
  },
];

const investPeriods = [
  {
    title: '1 месяц',
    value: 1,
    vkladPercent: 0.3603,
  },
  {
    title: '2 месяца',
    value: 2,
    vkladPercent: 0.2701,
  },
  {
    title: '3 месяца',
    value: 3,
    vkladPercent: 0.21,
  },
  {
    title: '6 месяцев',
    value: 6,
    vkladPercent: 0.1802,
  },
  {
    title: '12 месяцев',
    value: 12,
    vkladPercent: 0.15,
  },
];

const MIN_INVEST_SUM = 60_000;

const docNumberPds = randomDocNumber();
const docNumberVklad = randomDocNumber();
const emailRu = randomEmailRu();

export const App = () => {
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [collapsedItems, setCollapsedItem] = useState<string[]>([]);
  const [steps, setSteps] = useState<'init' | 'step1' | 'step2' | 'step-confirm3' | 'step-confirmed3' | 'step3' | 'step4'>(
    'init',
  );
  const [sum, setSum] = useState(MIN_INVEST_SUM);
  const [error, setError] = useState('');
  const [invetstPeriod, setInvestPeriod] = useState<number>(1);
  const [otpCode, setOtpCode] = useState('');

  const shouldErrorInvestSum = !sum || sum < MIN_INVEST_SUM;
  const investPeriodData = investPeriods.find(period => period.value === invetstPeriod) ?? investPeriods[0];
  const vkladSum = round(sum / 2);
  const pdsSum = round(sum / 2);
  const taxRefund = calculateTaxRefund(pdsSum);
  const govCharity = calculateStateSupport(pdsSum);
  const investmentsIncome = calculateInvestmentIncome(pdsSum, 0);
  const total = investmentsIncome + govCharity + taxRefund;

  const withOtpCode = steps === 'step-confirm3' || steps === 'step4';

  useTimeout(
    () => {
      setOtpCode(randomOtpCode());
    },
    withOtpCode ? 2500 : null,
  );
  useTimeout(
    () => {
      if (steps === 'step-confirm3') {
        window.gtag('event', '7106_sms_pds', { var: 'var5' });
        sendDataToGA({
          sum: pdsSum,
          product_type: 'ПДС',
        });
        setSteps('step-confirmed3');
      }
      if (steps === 'step4') {
        window.gtag('event', '7106_sms_deposit', { var: 'var5' });
        submit();
      }
      setOtpCode('');
    },
    withOtpCode ? 3500 : null,
  );

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = () => {
    sendDataToGA({
      sum: vkladSum,
      product_type: 'Вклад',
    });
    setThx(true);
    LS.setItem(LSKeys.ShowThx, true);
  };

  const goToStep2 = () => {
    window.gtag('event', '7106_open_pds', { var: 'var5' });
    if (shouldErrorInvestSum) {
      setError('Минимальная сумма — 60 000 ₽');
      return;
    }

    setSteps('step2');
  };

  const goToConfirmStep3 = () => {
    window.gtag('event', '7106_pay_pds', { var: 'var5' });
    setSteps('step-confirm3');
  };

  const handleChangeInput = (_: React.ChangeEvent<HTMLInputElement> | null, { value }: { value: number | null }) => {
    if (error) {
      setError('');
    }
    setSum(value ?? 0);
  };
  if (thxShow) {
    return <ThxLayout />;
  }

  if (steps === 'step3') {
    return (
      <>
        <div className={appSt.container}>
          <Typography.Text view="caps" style={{ marginTop: '1rem' }}>
            ШАГ 3 из 3
          </Typography.Text>

          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            Открытие вклада
          </Typography.TitleResponsive>

          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Номер договора
            </Typography.Text>
            <Typography.Text view="primary-medium">№{docNumberVklad}</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Сумма взноса
            </Typography.Text>
            <Typography.Text view="primary-medium">{vkladSum.toLocaleString('ru-RU')} ₽</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Процент по вкладу
            </Typography.Text>
            <Typography.Text view="primary-medium">
              {(investPeriodData.vkladPercent * 100).toLocaleString('ru-RU')}%
            </Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Срок вклада
            </Typography.Text>
            <Typography.Text view="primary-medium">{investPeriodData.title}</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Email
            </Typography.Text>
            <Typography.Text view="primary-medium">{emailRu}</Typography.Text>
          </div>
        </div>

        <Gap size={128} />

        <div className={appSt.bottomBtn()}>
          <Button
            block
            view="primary"
            onClick={() => {
              window.gtag('event', '7106_pay_deposit_var5');
              setSteps('step4');
            }}
          >
            Оплатить вклад
          </Button>
        </div>
      </>
    );
  }

  if (steps === 'step-confirmed3') {
    return (
      <div style={{ backgroundColor: '#494949', minHeight: '100dvh' }}>
        <div className={appSt.container}>
          <div>
            <Typography.Text
              view="component-primary"
              color="primary-inverted"
              style={{ textAlign: 'center', marginTop: '1rem' }}
              tag="p"
              defaultMargins={false}
            >
              Операция выполнена
            </Typography.Text>
            <Typography.Text
              view="secondary-large"
              color="secondary-inverted"
              style={{ textAlign: 'center' }}
              tag="p"
              defaultMargins={false}
            >
              Текущий счёт
            </Typography.Text>
          </div>

          <div className={appSt.box4}>
            <div style={{ marginTop: '-3rem' }}>
              <SuperEllipse size={80} backgroundColor="#0CC44D">
                <CheckmarkMIcon width={30} height={30} color="#fff" />
              </SuperEllipse>
            </div>
            <Typography.TitleResponsive
              tag="h1"
              view="medium"
              font="system"
              weight="semibold"
              style={{ textAlign: 'center', marginTop: '1rem' }}
            >
              {vkladSum.toLocaleString('ru-RU')} ₽
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small">Деньги зарезервированы и спишутся после открытия вклада</Typography.Text>
            <Typography.Text view="primary-small" color="secondary">
              Договор №{docNumberPds}
            </Typography.Text>
          </div>
        </div>

        <Gap size={128} />

        <div className={appSt.bottomBtn({ confirmed: true })}>
          <Button
            block
            view="secondary"
            onClick={() => {
              window.gtag('event', '7106_open_deposit_after_pds', { var: 'var5' });
              setSteps('step3');
            }}
            style={{ backgroundColor: '#FFFFFF24', color: '#fff' }}
          >
            Открыть вклад
          </Button>
        </div>
      </div>
    );
  }

  if (withOtpCode) {
    return (
      <div className={appSt.container}>
        <Typography.TitleResponsive
          tag="h1"
          view="xsmall"
          font="system"
          weight="semibold"
          style={{ textAlign: 'center', marginTop: '1rem' }}
        >
          Введите код из сообщения
        </Typography.TitleResponsive>

        <div className={appSt.codeInput}>
          <div className={appSt.codeInputItem}>{otpCode[0]}</div>
          <div className={appSt.codeInputItem}>{otpCode[1]}</div>
          <div className={appSt.codeInputItem}>{otpCode[2]}</div>
          <div className={appSt.codeInputItem}>{otpCode[3]}</div>
        </div>
        <Typography.Text view="secondary-large" color="secondary" style={{ textAlign: 'center' }}>
          Код отправлен на +7 ••• ••• •• •8
        </Typography.Text>
        <Spinner style={{ margin: 'auto' }} visible preset={24} />
      </div>
    );
  }

  if (steps === 'step2') {
    return (
      <>
        <div className={appSt.container}>
          <Typography.Text view="caps" style={{ marginTop: '1rem' }}>
            ШАГ 2 из 3
          </Typography.Text>

          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            Открытие ПДС
          </Typography.TitleResponsive>

          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Номер договора
            </Typography.Text>
            <Typography.Text view="primary-medium">№{docNumberPds}</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Сумма взноса
            </Typography.Text>
            <Typography.Text view="primary-medium">{pdsSum.toLocaleString('ru-RU')} ₽</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Email
            </Typography.Text>
            <Typography.Text view="primary-medium">{emailRu}</Typography.Text>
          </div>
        </div>

        <Gap size={128} />

        <div className={appSt.bottomBtn()}>
          <Typography.Text view="primary-small" color="secondary" style={{ textAlign: 'center' }}>
            После откроем вклад на тех же условиях
          </Typography.Text>
          <Button block view="primary" onClick={goToConfirmStep3}>
            Оплатить ПДС
          </Button>
        </div>
      </>
    );
  }

  if (steps === 'step1') {
    return (
      <>
        <div className={appSt.container}>
          <Typography.Text view="caps" style={{ marginTop: '1rem' }}>
            ШАГ 1 из 3
          </Typography.Text>

          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            Заполните данные
          </Typography.TitleResponsive>

          <Typography.Text view="primary-medium" color="secondary">
            Далее вы подтвердите открытие ПДС и вклада
          </Typography.Text>

          <div style={{ marginTop: '12px' }}>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Счёт списания
            </Typography.Text>

            <div className={appSt.bannerAccount}>
              <img src={rubIcon} width={48} height={48} alt="rubIcon" />

              <Typography.Text view="primary-small" weight="medium">
                Текущий счёт
              </Typography.Text>
            </div>
          </div>

          <div>
            <AmountInput
              label="Cумма инвестиций"
              labelView="outer"
              value={sum}
              error={error}
              onChange={handleChangeInput}
              block
              minority={1}
              bold={false}
              min={MIN_INVEST_SUM}
            />
            {!shouldErrorInvestSum && (
              <>
                <div className={appSt.rowSb} style={{ marginTop: '.5rem' }}>
                  <Typography.Text view="primary-small" color="secondary">
                    На вклад
                  </Typography.Text>
                  <Typography.Text view="primary-small" color="secondary">
                    {round(sum / 2).toLocaleString('ru-RU')} ₽
                  </Typography.Text>
                </div>
                <div className={appSt.rowSb}>
                  <Typography.Text view="primary-small" color="secondary">
                    На ПДС
                  </Typography.Text>
                  <Typography.Text view="primary-small" color="secondary">
                    {round(sum / 2).toLocaleString('ru-RU')} ₽
                  </Typography.Text>
                </div>
              </>
            )}
          </div>

          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              На какой срок открыть вклад
            </Typography.Text>
          </div>
        </div>

        <div>
          <Swiper style={{ margin: '-8px 0 1rem 1rem' }} spaceBetween={12} slidesPerView="auto">
            {investPeriods.map(({ title, value }) => (
              <SwiperSlide key={value} className={appSt.swSlide}>
                <Tag
                  view="filled"
                  size="xxs"
                  shape="rectangular"
                  checked={invetstPeriod === value}
                  onClick={() => setInvestPeriod(value)}
                >
                  {title}
                </Tag>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={appSt.box2}>
          <Typography.TitleResponsive tag="h2" view="xsmall" font="system" weight="semibold">
            Ваша выгода по двум продуктам
          </Typography.TitleResponsive>

          <div className={appSt.box3}>
            <Typography.Text view="primary-small" weight="medium">
              Вклад
            </Typography.Text>

            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Ставка
              </Typography.Text>
              <Typography.Text view="primary-small">
                {(investPeriodData.vkladPercent * 100).toLocaleString('ru-RU')}% годовых
              </Typography.Text>
            </div>
            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Срок
              </Typography.Text>
              <Typography.Text view="primary-small">{investPeriodData.title}</Typography.Text>
            </div>
            <Divider />

            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Доход за срок
              </Typography.Text>
              <Typography.Text view="primary-medium" weight="medium">
                {calcIncomeByMonths(vkladSum, investPeriodData.vkladPercent, invetstPeriod).toLocaleString('ru-RU')} ₽
              </Typography.Text>
            </div>
          </div>
          <div className={appSt.box3}>
            <Typography.Text view="primary-small" weight="medium">
              ПДС
            </Typography.Text>

            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Срок
              </Typography.Text>
              <Typography.Text view="primary-small">15 лет</Typography.Text>
            </div>
            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Доход от инвестиций
              </Typography.Text>
              <Typography.Text view="primary-small">{investmentsIncome.toLocaleString('ru-RU')} ₽</Typography.Text>
            </div>
            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Государство добавит
              </Typography.Text>
              <Typography.Text view="primary-small">{govCharity.toLocaleString('ru-RU')} ₽</Typography.Text>
            </div>
            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Налоговые вычеты добавят
              </Typography.Text>
              <Typography.Text view="primary-small">{taxRefund.toLocaleString('ru-RU')} ₽</Typography.Text>
            </div>
            <Divider />

            <div className={appSt.rowSb}>
              <Typography.Text view="primary-small" color="secondary">
                Доход за срок
              </Typography.Text>
              <Typography.Text view="primary-medium" weight="medium">
                {total.toLocaleString('ru-RU')} ₽
              </Typography.Text>
            </div>
          </div>
        </div>

        <Gap size={128} />

        <div className={appSt.bottomBtn()}>
          <Typography.Text view="primary-small" color="secondary" style={{ textAlign: 'center' }}>
            После откроем вклад на тех же условиях
          </Typography.Text>
          <Button block view="primary" onClick={goToStep2}>
            Открыть ПДС
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={appSt.containerApp}>
        <div className={appSt.container}>
          <img
            src={hbImg}
            width={258}
            height={213}
            alt="Hb"
            style={{ objectFit: 'contain', margin: 'auto', marginTop: '1rem' }}
          />
          <Typography.TitleResponsive
            style={{ textAlign: 'center' }}
            tag="h1"
            view="large"
            font="system"
            weight="semibold"
            color="primary-inverted"
          >
            Альфа‑Вклад
          </Typography.TitleResponsive>
          <Typography.Text style={{ textAlign: 'center' }} view="primary-medium" color="primary-inverted">
            Получите повышенную ставку по вкладу с программой долгосрочных сбережений
          </Typography.Text>
        </div>

        <div className={appSt.containerB}>
          {impItems.map(({ title, subtitle, Icon }) => (
            <PureCell key={title}>
              <PureCell.Graphics verticalAlign="center">
                <SuperEllipse size={48}>
                  <Icon color="#030306E0" />
                </SuperEllipse>
              </PureCell.Graphics>
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-small" weight="bold">
                    {title}
                  </Typography.Text>
                  <Typography.Text view="primary-small" color="secondary">
                    {subtitle}
                  </Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
            </PureCell>
          ))}

          <div />

          <PureCell className={appSt.cellBanner} verticalPadding="airy" horizontalPadding="both">
            <PureCell.Graphics verticalAlign="center">
              <img src={moneyImg} width={32} height={32} alt="money" />
            </PureCell.Graphics>
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="secondary-large">
                  Предложение действует с 12 января по 8 февраля 2026 года
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
          </PureCell>

          <div />

          <div className={appSt.box}>
            <Typography.TitleResponsive tag="h3" view="small" font="system" weight="semibold">
              Программа долгосрочных сбережений (ПДС)
            </Typography.TitleResponsive>

            <Typography.Text view="primary-small">
              Это новый инструмент для накоплений с финансовой поддержкой государства
            </Typography.Text>
            <Typography.Text view="primary-small">
              Подойдёт тем, кто хочет накопить на большие цели в будущем или получать дополнительный доход на пенсии
            </Typography.Text>

            <div>
              <Swiper style={{ marginLeft: '0' }} spaceBetween={12} slidesPerView="auto">
                {pdsSlides.map(({ img, title, subtitle }) => (
                  <SwiperSlide key={title} className={appSt.boxSlide}>
                    <PureCell>
                      <PureCell.Graphics verticalAlign="top">
                        <img src={img} width={32} height={32} alt={title} />
                      </PureCell.Graphics>
                      <PureCell.Content>
                        <PureCell.Main>
                          <Typography.Text view="primary-small" weight="medium">
                            {title}
                          </Typography.Text>
                          <Typography.Text view="secondary-large" color="secondary">
                            {subtitle}
                          </Typography.Text>
                        </PureCell.Main>
                      </PureCell.Content>
                    </PureCell>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h2" view="small" font="system" weight="medium">
            Как это работает
          </Typography.TitleResponsive>

          <Steps isVerticalAlign={true} interactive={false} className={appSt.stepStyle}>
            {hiw.map(item => (
              <span key={item.title}>
                <Typography.Text tag="p" defaultMargins={false} view="component-primary">
                  {item.title}
                </Typography.Text>
                <Typography.Text view="primary-small" color="secondary">
                  {item.desc}
                </Typography.Text>
              </span>
            ))}
          </Steps>

          <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h2" view="small" font="system" weight="medium">
            Дополнительные вопросы
          </Typography.TitleResponsive>

          {faqs.map((faq, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  window.gtag('event', '7106_bundle_faq', { faq: String(index + 1), var: 'var5' });

                  setCollapsedItem(items =>
                    items.includes(String(index + 1))
                      ? items.filter(item => item !== String(index + 1))
                      : [...items, String(index + 1)],
                  );
                }}
                className={appSt.rowSb}
              >
                <Typography.Text view="primary-medium" weight="medium">
                  {faq.question}
                </Typography.Text>
                {collapsedItems.includes(String(index + 1)) ? (
                  <div style={{ flexShrink: 0 }}>
                    <ChevronUpMIcon />
                  </div>
                ) : (
                  <div style={{ flexShrink: 0 }}>
                    <ChevronDownMIcon />
                  </div>
                )}
              </div>
              <Collapse expanded={collapsedItems.includes(String(index + 1))}>
                {faq.answers.map((answerPart, answerIndex) => (
                  <Typography.Text key={answerIndex} tag="p" defaultMargins={false} view="primary-medium">
                    {answerPart}
                  </Typography.Text>
                ))}
              </Collapse>
            </div>
          ))}
        </div>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn()}>
        <Button
          block
          view="primary"
          onClick={() => {
            window.gtag('event', '7106_start_open_bundle', { var: 'var5' });
            setSteps('step1');
          }}
        >
          Открыть Вклад + ПДС
        </Button>
      </div>
    </>
  );
};
