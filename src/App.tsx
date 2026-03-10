import { AmountInput } from '@alfalab/core-components/amount-input/cssm';
import { BottomSheet } from '@alfalab/core-components/bottom-sheet/cssm';
import { Button } from '@alfalab/core-components/button/cssm';
import { Collapse } from '@alfalab/core-components/collapse/cssm';
import { Divider } from '@alfalab/core-components/divider/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { SuperEllipse } from '@alfalab/core-components/icon-view/cssm/super-ellipse';
import { Spinner } from '@alfalab/core-components/spinner/cssm';
import { Steps } from '@alfalab/core-components/steps/cssm';
import { Tag } from '@alfalab/core-components/tag/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ChevronUpMIcon } from '@alfalab/icons-glyph/ChevronUpMIcon';
import { DocumentLinesLineMIcon } from '@alfalab/icons-glyph/DocumentLinesLineMIcon';
import { PercentMIcon } from '@alfalab/icons-glyph/PercentMIcon';
import { QuestionCircleLineMIcon } from '@alfalab/icons-glyph/QuestionCircleLineMIcon';
import { Fragment, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import percentImg from './assets/percent.png';
import rubIcon from './assets/rub.png';
import shieldImg from './assets/shield.png';
import { CheckIcon } from './CheckIcon';
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

const hiw = [
  {
    title: 'Оформите ПДС в приложении',
    desc: 'На сумму от 30 000 ₽ — это ваш первый взнос в программу, дальше любая сумма',
  },
  {
    title: 'Откройте Альфа‑Вклад',
    desc: 'Сумма не больше первого взноса в ПДС',
  },
  {
    title: 'Получайте больше дохода',
    desc: 'По вкладу с повышенной ставкой и от инвестиций в ПДС',
  },
];

const faqs = [
  {
    question: 'Что такое ПДС?',
    answers: [
      'Программа долгосрочных сбережений (ПДС) — это накопительный продукт с финансовой поддержкой государства. С ним вы можете накопить на долгосрочные цели или создать пенсионный капитал.',
    ],
  },
  {
    question: 'Сколько денег нужно вносить на ПДС-счёт?',
    answers: [
      'Чтобы государство софинансировало ваши взносы, пополнять счёт нужно на сумму не менее 2000 ₽ в год.',
      'Однако вы можете отталкиваться от вашего дохода и пополнять счёт на любую другую сумму.',
      'Деньги можно внести один раз за год или вносить несколькими платежами в течение года. Чтобы не забывать пополнять счёт, подключите автоплатёж.',
    ],
  },
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

const btns = [
  {
    title: 'Какие условия',
    icon: <PercentMIcon color="#000000" />,
    link: 'conditions' as const,
  },
  {
    title: 'Как оформить',
    icon: <DocumentLinesLineMIcon color="#000000" />,
    link: 'how-to' as const,
  },
  {
    title: 'Вопросы и ответы',
    icon: <QuestionCircleLineMIcon color="#000000" />,
    link: 'questions' as const,
  },
];

const MIN_INVEST_SUM = 60_000;

const docNumberVklad = randomDocNumber();
const emailRu = randomEmailRu();

export const App = () => {
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [showBs, setShowBs] = useState<'conditions' | 'how-to' | 'questions' | ''>('');
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

  const withOtpCode = steps === 'step3';

  useTimeout(
    () => {
      setOtpCode(randomOtpCode());
    },
    withOtpCode ? 2500 : null,
  );
  useTimeout(
    () => {
      window.gtag('event', '7364_sms_pds_deposit_step3', { var: 'var5' });

      submit();
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
    window.gtag('event', '7364_click_open_pds_deposit_step1', { var: 'var5' });
    if (shouldErrorInvestSum) {
      setError('Минимальная сумма — 60 000 ₽');
      return;
    }

    setSteps('step2');
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
          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold" style={{ marginTop: '1rem' }}>
            Всё проверьте, и можно оплатить
          </Typography.TitleResponsive>

          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Номер договора
            </Typography.Text>
            <Typography.Text view="primary-medium">№{docNumberVklad}</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Общая сумма взноса
            </Typography.Text>
            <Typography.Text view="primary-medium">{sum.toLocaleString('ru-RU')} ₽</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Сумма ПДС
            </Typography.Text>
            <Typography.Text view="primary-medium">{pdsSum.toLocaleString('ru-RU')} ₽</Typography.Text>
          </div>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Сумма на вклад
            </Typography.Text>
            <Typography.Text view="primary-medium">{vkladSum.toLocaleString('ru-RU')} ₽</Typography.Text>
          </div>

          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Срок вклада
            </Typography.Text>
            <Typography.Text view="primary-medium">{investPeriodData.title}</Typography.Text>
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
              window.gtag('event', '7364_click_pay_pds_deposit_step2', { var: 'var5' });
              setSteps('step3');
            }}
          >
            Оплатить
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h1" view="large" font="system" weight="semibold">
          Повышенная ставка по вкладу при подключении ПДС
        </Typography.TitleResponsive>

        <div className={appSt.btnsContainer}>
          {btns.map(btn => (
            <div
              key={btn.title}
              className={appSt.btnContainer}
              onClick={() => {
                setShowBs(btn.link);
              }}
            >
              <SuperEllipse>{btn.icon}</SuperEllipse>
              <Typography.Text view="primary-small">{btn.title}</Typography.Text>
            </div>
          ))}
        </div>

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
        <Button block view="primary" onClick={goToStep2}>
          Открыть вклад и ПДС
        </Button>
      </div>
      <BottomSheet
        open={showBs === 'conditions'}
        onClose={() => {
          setShowBs('');
        }}
        contentClassName={appSt.btmContent}
      >
        <div className={appSt.container}>
          <div>
            <Typography.TitleResponsive tag="h2" view="small" font="system" weight="medium">
              Два продукта работают вместе
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small" color="secondary">
              Вы получаете доход по вкладу и деньги от государства одновременно
            </Typography.Text>
          </div>

          <div className={appSt.box}>
            <div className={appSt.row}>
              <img src={percentImg} width={32} height={32} alt="percentIcon" />
              <Typography.Text view="primary-medium" weight="medium">
                Альфа-Вклад
              </Typography.Text>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Процент
                  <br />
                  по вкладу
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    До 36% годовых
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
              <Divider />
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Минимальная
                  <br />
                  сумма вклада
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    От 30 000 ₽
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
              <Divider />
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Условия
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    Без пополнения
                    <br />и снятия
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
            </div>
          </div>
          <div className={appSt.box}>
            <div className={appSt.row}>
              <img src={shieldImg} width={32} height={32} alt="shieldIcon" />
              <Typography.Text view="primary-medium" weight="medium">
                Программа долгосрочных сбережений (ПДС)
              </Typography.Text>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Налоговый
                  <br />
                  вычет за 15 лет
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    До 1 320 000 ₽
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
              <Divider />
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Доплата
                  <br />
                  от государства
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    До 360 000 ₽
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
              <Divider />
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Инвестиционный <br />
                  доход
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <Typography.Text view="primary-small" weight="medium">
                    21,56% <br />
                    годовых
                  </Typography.Text>
                  <CheckIcon />
                </div>
              </div>
              <Divider />
              <div className={appSt.rowSb}>
                <Typography.Text view="primary-small" color="secondary">
                  Первый взнос
                  <br /> в ПДС
                </Typography.Text>
                <div className={appSt.rowSb} style={{ width: '50%' }}>
                  <div>
                    <Typography.Text view="primary-small" weight="medium" tag="p" defaultMargins={false}>
                      от 30 000 ₽
                    </Typography.Text>
                    <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                      дальше любая сумма
                    </Typography.Text>
                  </div>
                  <CheckIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
      <BottomSheet
        open={showBs === 'how-to'}
        onClose={() => {
          setShowBs('');
        }}
        contentClassName={appSt.btmContent}
      >
        <div className={appSt.container}>
          <Typography.TitleResponsive
            style={{ marginTop: '1rem' }}
            tag="h2"
            view="small"
            font="system"
            weight="medium"
            id="how-to"
          >
            Три шага — и деньги работают
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
        </div>
      </BottomSheet>
      <BottomSheet
        open={showBs === 'questions'}
        onClose={() => {
          setShowBs('');
        }}
        contentClassName={appSt.btmContent}
      >
        <div className={appSt.container}>
          <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h2" view="small" font="system" weight="medium">
            Вопросы и ответы
          </Typography.TitleResponsive>

          {faqs.map((faq, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  window.gtag('event', '7364_bundle_faq', { faq: String(index + 1), var: 'var5' });

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
                  <Fragment key={answerIndex}>
                    <Typography.Text tag="p" defaultMargins={false} view="primary-medium">
                      {answerPart}
                    </Typography.Text>
                    <Gap size={8} />
                  </Fragment>
                ))}
              </Collapse>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};
