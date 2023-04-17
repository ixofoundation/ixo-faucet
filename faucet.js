import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { FrequencyChecker } from './checker';
import dotenv from 'dotenv';
import { getSignerData } from './store';

dotenv.config();
import conf from './config';
// console.log('loaded config: ', conf);

const app = express();
app.use(cors());

const checker = new FrequencyChecker(conf);

app.get('/', (req, res) => {
	res.sendFile(path.resolve('./index.html'));
});

app.get('/config.json', async (req, res) => {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC, conf.sender.option);
	const [firstAccount] = await wallet.getAccounts();
	const project = conf.project;
	project.sample = firstAccount.address;
	project.name = process.env.PROJECT_NAME;
	res.send(project);
});

app.get('/send/:address', async (req, res) => {
	const { address } = req.params;
	console.log('request tokens to ', address, req.ip);
	if (address) {
		try {
			if (address.startsWith(conf.sender.option.prefix)) {
				// if ((await checker.checkAddress(address)) && (await checker.checkIp(req.ip))) {
				if (await checker.checkAddress(address)) {
					// checker.update(req.ip); // get ::1 on localhost
					sendTx(address).then(ret => {
						console.log('sent tokens to ', address);
						checker.update(address);
						res.send({ result: ret });
					});
				} else {
					res.send({ result: 'You requested too often' });
				}
			} else {
				res.send({ result: `Address (${address}) is not supported.` });
			}
		} catch (err) {
			console.error(err);
			res.send({ result: 'Failed, Please try again in a bit or contact Ixo admin' });
		}
	} else {
		// send result
		res.send({ result: 'Address is required' });
	}
});

app.listen(conf.port, () => {
	console.log(`Faucet app listening on port ${conf.port}`);
});

async function sendTx(recipient) {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC, conf.sender.option);
	const [firstAccount] = await wallet.getAccounts();
	// console.log("sender", firstAccount);

	const client = await SigningStargateClient.connectWithSigner(process.env.RPC_ENDPOINT, wallet);

	const amount = conf.tx.amount;
	const fee = conf.tx.fee;

	const sendMsg = {
		typeUrl: '/cosmos.bank.v1beta1.MsgSend',
		value: {
			fromAddress: firstAccount.address,
			toAddress: recipient,
			amount: [amount],
		},
	};

	const signerData = await getSignerData(client, wallet);

	const txRaw = await client.sign(firstAccount.address, [sendMsg], fee, conf.memo, signerData);
	const txBytes = TxRaw.encode(txRaw).finish();

	return client.broadcastTx(txBytes, client.broadcastTimeoutMs, client.broadcastPollIntervalMs);
}
