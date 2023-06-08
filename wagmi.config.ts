import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/wagmi.generated.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '.',
      include: ['Faucet.sol/*.json'],
      deployments: {
        MyToken: 'Ox$address du contract'
      }
    }),
  ],
});
