This is a demo application from Spanning Labs to showcase the capabilities of the Spanning Network. It allows to interact with a specified token and nft, utilizing the Spanning Network's smart contracts.

## Getting Started

First install the dependencies

```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Then, open the browser and go to http://localhost:3000/

## Layout

The entrypoint of the app is `pages/_app.tsx`.

- This file checks a couple of preconditions (desktop user, metamask, Spanning Network status) and then renders the app.
- It contains the style settings
  The bulk of the content is rendered in `pages/index.tsx`.
- It contains the nav bar, page content, and overlays
- Web3 refresh rates are specified here

Most core files are in the `components/` directory.

- Token sub-components are in `components/token/`.
- NFT sub-components are in `components/nft/`.
- Form components are in `components/forms/`.

The App's connection to web3 is handled by `components/SpanningWeb3Context.tsx`. If you would like to override the default provider settings, you can do so in `components/SpanningWeb3Context.tsx`.
