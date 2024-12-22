import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    gap: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    extend: {
      screens: {
        esm: {
          min: '360px',
        },
        sm: {
          min: '560px',
        },
        md: {
          min: '760px',
        },
        xl: {
          min: '1024px',
        },
        '2xl': {
          min: '1260px',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            background: {
              '50': '#f5f5f5',
              '100': '#fafafa',
              '200': '#ffffff',
            },
            foreground: '#000',
            primary: {
              DEFAULT: '#2A9D8F',
            },
            secondary: {
              DEFAULT: '#ebf6f7',
            },
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            background: {
              '50': '#212121',
              '100': '#303030',
              '200': '#424242',
            },
            foreground: '#FFF',
            primary: {
              DEFAULT: '#2A9D8F',
            },
            secondary: {
              DEFAULT: '#282828',
            },
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ],
};
export default config;