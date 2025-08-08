import { defineConfig } from 'unocss/vite';
import { presetWebFonts } from 'unocss/preset-web-fonts';
import { presetWind4 } from 'unocss/preset-wind4';
import { transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      "black": "#000000",
      "input": "#080808",
      "inactive": "#202020",
      "side": "#787878",
      "common": "#C8C8C8",
      "white": "#FFFFFF",
      "main": "#84CC16",
      "main-hover": "#4D7C0F",
      "danger": "#F43F5E",
      "danger-hover": "#BE123C",
      "pro": "#EAB308",
    },
  },
  shortcuts: {
    input:
      'h-10 px-4 w-full bg-input rounded-lg border border-inactive text-white placeholder-side outline-none focus:border-white',
    "text-area": "min-h-10 px-4 py-3 w-full bg-input rounded-lg border border-inactive text-white leading-relaxed placeholder-side outline-none resize-none focus:border-white",
    button: 'w-full px-4 h-10 flex items-center justify-center text-white font-medium',
    'button--main': 'h-10 px-8 flex items-center justify-center bg-main hover:bg-main-hover text-white font-bold rounded-lg outline-none focus:(ring-2 ring-white)',
    'button--side': "h-10 px-8 flex items-center justify-center bg-inactive hover:bg-transparent text-white rounded-lg focus:(ring-2 ring-white)",
    'button-square': 'size-12 flex items-center justify-center text-white font-medium',
    'heading-1': "text-3xl font-bold text-white tracking-tight",
    "heading-2": "text-2xl font-bold text-white tracking-tight",
  },
  transformers: [transformerDirectives({ applyVariable: '--uno' }), transformerVariantGroup()],
  presets: [
    presetWind4(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        satoshi: 'Satoshi',
      }
    })
  ]
});