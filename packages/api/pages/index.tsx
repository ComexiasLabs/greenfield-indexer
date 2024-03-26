import React from 'react';
import { Button, Grid, Typography, Box, Tab } from '@mui/material';
import { Navigation } from '@mui/icons-material';
import styles from '../styles/Main.module.scss';
import Head from 'next/head';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CopyBlock, atomOneDark } from 'react-code-blocks';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArticleIcon from '@mui/icons-material/Article';

const HomePage = () => {
  const [value, setValue] = React.useState('mainnet');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Greenfield Indexer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <main className={styles.main}>
          <img src="/assets/gi-logo-dark.svg" alt="Greenfield Indexer" style={{ height: 48 }} />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid container spacing={2} sx={{ marginTop: 2 }} maxWidth={900} justifyContent="center">
            <Box sx={{ padding: 2 }} className={styles.intro}>
              <Typography variant="h4" component="div" gutterBottom className={styles.mainTitle}>
                Search service for BNB Greenfield
              </Typography>
              <Typography paragraph>
                Greenfield Indexer is an open-source service that indexes buckets and objects on BNB Greenfield and 
                make them <strong>available for search</strong> through an interactive API.
              </Typography>
            </Box>

            <Box sx={{ paddingTop: 4, width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Mainnet" value="mainnet" />
                    <Tab label="Testnet" value="testnet" />
                  </TabList>
                </Box>
                <TabPanel value="mainnet">
                  <CopyBlock
                    text="curl --location 'https://www.greenfieldindexer.com/api/info'"
                    language="javascript"
                    theme={atomOneDark}
                    showLineNumbers={false}
                    codeBlockStyle={{ padding: '10px' }}
                  />
                </TabPanel>
                <TabPanel value="testnet">
                  <CopyBlock
                    text="curl --location 'https://testnet.greenfieldindexer.com/api/info'"
                    language="javascript"
                    theme={atomOneDark}
                    showLineNumbers={false}
                    codeBlockStyle={{ padding: '10px' }}
                    wrapLongLines={true}
                  />
                </TabPanel>
              </TabContext>
            </Box>
            
            <Box sx={{ paddingTop: 8, display: 'flex', flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
              <Button
                variant="text"
                href="https://github.com/ComexiasLabs/greenfield-indexer/blob/main/docs/api-documentation.md"
                startIcon={<ArticleIcon />}
              >
                Docs
              </Button>
              <Button
                variant="text"
                href="https://github.com/ComexiasLabs/greenfield-indexer"
                startIcon={<GitHubIcon />}
              >
                Github
              </Button>
              <Button variant="text" href="https://x.com/comexiaslabs" startIcon={<TwitterIcon />}>
                X / Twitter
              </Button>
            </Box>
          </Grid>
        </Box>
      </main>
    </>
  );
};

export default HomePage;
