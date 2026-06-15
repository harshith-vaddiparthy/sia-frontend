// theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const styles = {
  global: {
    body: {
      bg: 'gray.800',
      color: 'gray.100',
    },
  },
};

const theme = extendTheme({
  config,
  styles,
  colors: {
    primary: {
      50: '#e3f2f9',
      100: '#c5e4f3',
      200: '#a2d4ec',
      300: '#7ac1e4',
      400: '#47a9da',
      500: '#0088cc',
      600: '#007ab8',
      700: '#006ba1',
      800: '#005885',
      900: '#003f5e',
    },
    secondary: {
      50: '#f2e7fe',
      100: '#dbbdfc',
      200: '#be93f7',
      300: '#9f67f5',
      400: '#8123f4',
      500: '#5d00e8',
      600: '#4d00cc',
      700: '#3d00a9',
      800: '#2e0085',
      900: '#200066',
    },
    neutral: {
      50: '#f5f5f5',
      100: '#ebebeb',
      200: '#dedede',
      300: '#cdcdcd',
      400: '#b9b9b9',
      500: '#9e9e9e',
      600: '#7e7e7e',
      700: '#626262',
      800: '#4b4b4b',
      900: '#323232',
    },
  },
});

export default theme;
