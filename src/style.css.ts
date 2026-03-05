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
const box = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  gap: '1rem',
  borderRadius: '24px',
  backgroundColor: '#F3F4F5',
});

const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
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

const btnsContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '335px',
  margin: '0 auto',
  width: '100%',
});

const btnContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  maxWidth: '76px',
  textAlign: 'center',
  alignItems: 'center',
});

const btmContent = style({
  padding: 0,
});

export const appSt = {
  bottomBtn,
  container,
  box,
  row,
  stepStyle,
  rowSb,
  bannerAccount,
  swSlide,
  box2,
  box3,
  codeInput,
  codeInputItem,
  box4,
  btnsContainer,
  btnContainer,
  btmContent,
};
