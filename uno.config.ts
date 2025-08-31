import { defineConfig } from 'unocss/vite';
import { presetWebFonts } from 'unocss/preset-web-fonts';
import { presetWind4 } from 'unocss/preset-wind4';
import { transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      "black": "#000000",
      "input": "#080808",
      "input-light": "#FAFAFA",
      "inactive": "#171717",
      "inactive-light": "#C8C8C8",
      "side": "#737373",
      "side-light": "#404040",
      "common": "#D4D4D4",
      "common-light": "#262626",
      "white": "#FFFFFF",
      "main": "#84CC16",
      "main-hover": "#4D7C0F",
      "danger": "#F43F5E",
      "danger-hover": "#BE123C",
      "pro": "#EAB308",
      "pro-light": "#CA8A04",
    },
  },
  shortcuts: {
    // Theme
    "#text-summit": "text-black dark:text-white",
    "#bg-ground": "bg-white dark:bg-black",
    "#text-common": "text-common-light dark:text-common",
    "#text-inactive": "text-inactive-light dark:text-inactive",
    "#bg-summit--inverted": "bg-black dark:bg-white",
    "#bg-input": "bg-input-light dark:bg-input",
    "#text-summit--inverted": "text-white dark:text-black",
    "#bordered": "border border-inactive-light dark:border-inactive",
    // Utility
    "flex-center": "flex items-center justify-center",
    // Component
    input:
      'h-10 px-4 w-full #bg-input #bordered rounded-lg #text-summit placeholder-side outline-none focus:border-black dark:focus:border-white',
    "text-area": "min-h-10 px-4 py-3 w-full #bg-input #bordered rounded-lg #text-summit leading-relaxed placeholder-side outline-none resize-none focus:border-black dark:focus:border-white",
    "bordered-b": "border-b border-inactive-light dark:border-inactive",
    "bordered-t": "border-t border-inactive-light dark:border-inactive",
    button: 'w-full px-4 h-10 flex-center #text-summit font-medium',
    'button--main': 'h-10 px-8 flex-center bg-main hover:bg-main-hover text-white font-bold rounded-lg outline-none focus:(ring-2 ring-white)',
    'button--side': "h-10 px-8 flex-center bg-inactive hover:bg-transparent text-white rounded-lg focus:(ring-2 ring-white)",
    'button-black-white-rounded': 'h-10 px-8 flex-center #bg-summit--inverted rounded-full #text-summit--inverted font-bold hover:cursor-pointer',
    'button-square': 'size-12 flex-center text-white font-medium',
    // Used in Dialog and Form
    "button-square-input": "size-10 min-w-10 flex-center bg-input-light dark:bg-input #bordered rounded-lg outline-none #text-summit focus:ring-2 focus:ring-black dark:focus:ring-white",
    'heading-1': "text-3xl font-bold text-white tracking-tight",
    "heading-2": "text-2xl font-bold text-white tracking-tight",
    'mobile-link-button': "min-w-12 max-w-12 h-12 flex flex-col items-center text-10px data-[active=true]:(#text-summit)",
  },
  transformers: [transformerDirectives({ applyVariable: '--uno' }), transformerVariantGroup()],
  presets: [
    presetWind4({
      preflights: { reset: true },
      dark: "class"
    }),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        satoshi: 'Satoshi',
      }
    })
  ]
});