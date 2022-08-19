import "@fontsource/work-sans";
import "@fontsource/mulish";

import { BOSPage, MetamaskPage, MobilePage } from "../components/FilledPage";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import Head from "next/head";
import { extendTheme } from "@chakra-ui/react";
import { useBosStatus } from "../hooks/useBosStatus";

const theme = extendTheme({
  styles: {
    global: {
      html: {
        margin: 0,
        padding: 0,
      },
      body: {
        margin: 0,
        padding: 0,
      },
    },
  },
  colors: {
    brand: {
      white: "#f4f4f4",
      primary: "#EDAC4B",
      primaryContrast: "#FFFFFF",
      primaryFaded: "#FDF7EF",
      lightGray: "#F3F3F3",
      gray: "F9FBFD",
      dark: "#3C3C3C",
      navPrimary: "#232323",
      navPrimaryContrast: "#FFFFFF",
      navSecondary: "#444444",
      question: "#545454",
      disabled: "#B0B0B0",
      activeText: "#3F3F3F",
      fadedText: "#737B7D",
    },
  },
  fonts: {
    body: "Mulish, sans-serif",
    heading: "Work Sans, sans-serif",
    mono: "Mulish, monospace",
    fontWeights: {
      bold: "700",
    },
  },
  components: {
    Card: {
      // The styles all Cards have in common
      baseStyle: {},
      // Two variants: rounded and smooth
      variants: {
        mint: {
          padding: "1rem",
          borderRadius: "lg",
          boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.5)",
          width: "220px",
          height: "280px",
          bg: "brand.primaryContrast",
        },
        nft: {
          padding: "1rem",
          borderRadius: "lg",
          boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.5)",
          width: "280px",
          height: "360px",
          bg: "brand.primaryContrast",
        },
        nftDetail: {
          padding: "1rem",
          borderRadius: "lg",
        },
      },
      defaultProps: {
        variant: "nft",
      },
    },
    Button: {
      variants: {
        primary: {
          bg: "brand.primary",
          color: "brand.primaryContrast",
          p: "1.5em",
          borderRadius: "lg",
          border: "2px",
          borderColor: "brand.primary",
          _hover: {
            bg: "brand.primaryFaded",
            color: "brand.primary",
            borderColor: "brand.primary",
            border: "2px",
          },
        },
        disabled: {
          disabled: true,
          bg: "brand.primaryFaded",
          color: "brand.primary",
          borderColor: "brand.primary",
          border: "2px",
          p: "1.5em",
          borderRadius: "lg",
        },
        light: {
          bg: "brand.primaryFaded",
          color: "brand.primary",
          p: "1.5em",
          borderRadius: "lg",
        },
        navStyle: {
          bg: "brand.navSecondary",
          color: "brand.white",
          p: "1.5rem",
          borderRadius: "lg",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
        },
        questions: {
          bg: "brand.question",
          color: "brand.white",
          p: "1.5rem",
          borderRadius: "lg",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
          fontWeight: "bold",
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Text: {
      variants: {
        title: {
          fontWeight: "700",
          fontSize: "5xl",
          color: "brand.activeText",
        },
        midtitle: {
          fontWeight: "700",
          fontSize: "3xl",
          color: "brand.activeText",
        },
        subtitle: {
          fontWeight: "400",
          fontSize: "lg",
          color: "brand.activeText",
        },
        tabs: {
          fontSize: "3xl",
          fontWeight: "bold",
        },
        tagline: {
          fontSize: "5xl",
          fontWeight: "bold",
          pt: "0.5rem",
        },
        code: {
          fontFamily: "monospace",
          color: "#edac4b",
          fontWeight: "bold",
          fontSize: "md",
        },
        codeBlack: {
          fontFamily: "monospace",
          color: "brand.black",
          fontWeight: "bold",
          fontSize: "lg",
        },
      },
    },
    Input: {
      variants: {
        primary: {
          p: "1.75em",
          size: "lg",
          border: "2px",
          borderColor: "#edac4b",
          focusBorderColor: "#edac4b",
        },
      },
    },
  },
});

const title = "Spanning Labs | Demo";
const description = "A demo of Spanning Tokens and NFTs.";
const shareImage = "https://demo.spanning.network/images/share.jpg";

function SpanningDemoApp({ Component, pageProps }: AppProps) {
  const [isMobileUser, setMobileUser] = useState(false);
  const [isMissingMetamask, setMissingMetamask] = useState(false);
  const { bosIsUp } = useBosStatus();

  // Check if the user is on a mobile device
  useEffect(() => {
    setMobileUser(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  // Check if the user has metamask installed
  useEffect(() => {
    setMissingMetamask(!window.ethereum);
  }, []);

  return (
    <>
      {/* Header Info */}
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://demo.spanning.network/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={shareImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={shareImage} />
      </Head>

      {/* App Content */}
      <ChakraProvider theme={theme}>
        <Flex h="100%" w="100%" m="0" p="0" bg="brand.white">
          {/* Run Checks:
            1. Check if mobile
            2. Check if metamask is installed
            3. Check if BOS is running
            4. Render Application! */}
          {(isMobileUser && <MobilePage />) ||
            (isMissingMetamask && <MetamaskPage />) ||
            (!bosIsUp && <BOSPage />) || <Component {...pageProps} />}
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default SpanningDemoApp;
