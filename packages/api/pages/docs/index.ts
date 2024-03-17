// pages/index.tsx

import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: 'https://github.com/ComexiasLabs/greenfield-indexer/blob/main/docs/api-documentation.md',
      permanent: false,
    },
  };
};

const HomePage = () => {
  return null;
};

export default HomePage;
