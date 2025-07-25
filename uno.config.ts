import { defineConfig } from 'unocss/vite';
import { presetWebFonts } from 'unocss/preset-web-fonts';
import { presetWind4 } from 'unocss/preset-wind4';
import { transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  shortcuts: {
    input:
      'h-12 px-4 w-full border border-neutral-800 text-white font-medium placeholder-neutral-500',
    "text-area": "min-h-12 px-4 py-3 w-full border border-neutral-800 text-white font-medium leading-relaxed placeholder-neutral-500",
    button: 'w-full px-4 h-12 flex items-center justify-center text-white font-medium',
    'button--main': 'border border-teal-400 hover:bg-teal-950',
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
        archivo: 'Archivo',
        general: 'General Sans',
        satoshi: 'Satoshi',
        supreme: "Supreme",
      }
    })
  ]
});