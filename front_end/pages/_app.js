import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Layout>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
