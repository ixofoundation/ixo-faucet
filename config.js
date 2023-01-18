import { stringToPath } from '@cosmjs/crypto';

export default {
	port: 80,
	db: {
		path: './db/faucet.db',
	},
	project: {
		name: 'Ixo Devnet',
		logo: 'https://p2psend.jambo.earth/_next/image?url=%2Fimages%2Flogo.png&w=3840&q=75',
	},
	blockchain: {
		rpc_endpoint: 'https://devnet.ixo.earth/rpc/',
	},
	sender: {
		option: {
			hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
			prefix: 'ixo',
		},
	},
	tx: {
		amount: {
			denom: 'uixo',
			amount: '10000000',
		},
		fee: {
			amount: [
				{
					amount: '1000',
					denom: 'uixo',
				},
			],
			gas: '200000',
		},
	},
	limit: {
		// how many times each wallet address is allowed in a window(24h)
		address: 1,
		// how many times each ip is allowed in a window(24h),
		// if you use proxy, double check if the req.ip is return client's ip.
		ip: 10,
	},
};
