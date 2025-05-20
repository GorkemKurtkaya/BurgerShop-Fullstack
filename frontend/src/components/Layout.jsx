import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, title = "Elmalı Restorant | İzmir'in Lezzet Durağı" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="İzmir'in en lezzetli restoranı" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout; 