import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                donuts: path.resolve(__dirname, 'src/donuts/index.html')
            }
        }
    }
}) 