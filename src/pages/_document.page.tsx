import { extractStaticStyle, StyleProvider } from 'antd-style';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const page = await ctx.renderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={extractStaticStyle.cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

    const styles = extractStaticStyle(page.html).map((item) => item.style);

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link type="image/png" sizes="96x96" rel="icon" href="/favicon.png" />
          <meta name="description" content="基于智能助理的对话生产力工具" />
          <meta property="og:description" content="基于智能助理的对话生产力工具" />
          <meta property="twitter:image" content="/favicon.png" />
          <meta property="og:title" content="TechFLow" />
          <meta property="og:image" content="/favicon.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="TechFLow" />
          <meta name="twitter:description" content="基于智能助理的对话生产力工具" />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:url" content="https://techflow.antdigital.dev/" />
          <link rel="apple-touch-icon" href="/favicon.png"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
