import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8090', // backend server address
				ws: true,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			},
            '/orion': {
                target: 'http://localhost:5052',
                ws: true,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/orion/, '')
            }
		}
	},
});
