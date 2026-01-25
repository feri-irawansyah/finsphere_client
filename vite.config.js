import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8901/api', // backend server address
				ws: true,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			},
		}
	},
});
