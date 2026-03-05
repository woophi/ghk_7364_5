import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const bottomBtn = recipe({
  base: {
    position: 'fixed',
    zIndex: 2,
    width: '100%',
    padding: '12px',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#FFFFFF',
  },
  variants: {
    confirmed: {
      true: {
        backgroundColor: 'transparent',
      },
    },
  },
});

const container = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
});
const containerB = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
});
const containerApp = style({
  background: 'linear-gradient(153.31deg, #0922E3 4.46%, #269AF4 95.54%)',
});

const box = style({
  display: 'flex',
  padding: '20px 20px 24px',
  flexDirection: 'column',
  gap: '20px',
  borderRadius: '1rem',
  backgroundColor: '#EEEDFF',
});

const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const cellBanner = style({
  backgroundColor: '#F2F3F5',
  borderRadius: '1rem',
});

const boxSlide = style({
  display: 'flex',
  padding: '12px',
  borderRadius: '12px',
  backgroundColor: '#FFFFFF',
  width: '228px',
  height: '80px',
});

const stepStyle = style({});
globalStyle(`${stepStyle} > div > div > div[class^="_option_"]`, {
  backgroundColor: '#EF3124',
  color: 'var(--color-light-text-primary-inverted)',
});

const rowSb = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
});

const bannerAccount = style({
  padding: '1rem',
  backgroundColor: '#F5F5F8',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '6px',
});

const swSlide = style({
  width: 'min-content',
});

const box2 = style({
  display: 'flex',
  padding: '20px 1rem',
  flexDirection: 'column',
  gap: '20px',
  borderRadius: '20px',
  backgroundColor: '#F5F5F8',
});
const box3 = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '1rem',
  backgroundColor: '#FFFFFF',
});

const codeInput = style({
  margin: '4rem auto 0',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const codeInputItem = style({
  width: '36px',
  height: '48px',
  borderRadius: '6px',
  backgroundColor: '#2637580f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px',
  fontWeight: '600',
});

const box4 = style({
  display: 'flex',
  padding: '12px',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  borderRadius: '28px',
  backgroundColor: '#F5F5F8',
  margin: '10rem auto 0',
  textAlign: 'center',
});

export const appSt = {
  bottomBtn,
  container,
  box,
  row,
  containerApp,
  containerB,
  cellBanner,
  boxSlide,
  stepStyle,
  rowSb,
  bannerAccount,
  swSlide,
  box2,
  box3,
  codeInput,
  codeInputItem,
  box4,
};
