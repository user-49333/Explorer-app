import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // docs/ solo guarda capturas y referencias de Figma: no hace falta vigilarla
  server: { watch: { ignored: ['**/docs/**'] } },
  plugins: [tailwindcss(), tanstackStart(), nitro(), viteReact()],
})

export default config
