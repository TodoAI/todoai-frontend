import type { Config } from 'tailwindcss'

const feur = {
  50: '#f1f8fe',
  100: '#e2f1fc',
  200: '#bee3f9',
  300: '#84cdf5',
  400: '#42b2ee',
  500: '#1a98dd',
  600: '#0d7cc0',
  700: '#0c6098',
  800: '#0e537e',
  900: '#114569',
  950: '#0c2c45'
}

export default <Partial<Config>> {
  theme: {
    extend: {
      colors: {
        feur,
        'main-bg': '#D0E0EA'
      }
    }
  }
}
