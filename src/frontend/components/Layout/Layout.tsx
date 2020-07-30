import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useTokenManager from '@hooks/useTokenManager';
import useErrorHandler from '@hooks/useErrorHandler';
import { RootState } from '@redux/store';
import ThemeProvider, { ThemeString } from '@components/ThemeProvider';
import BackgroundImage from '@components/BackgroundImage';
import Header from '@components/Header';
// import Sidebar from '../Sidebar';
import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';

const Main = styled.main`
  display: flex;
  min-height: 100%;
  position: relative;
`;

interface ContentProps {
  mustAddMarginBottom: boolean;
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  position: relative;
  margin: 0 auto ${(props: ContentProps) => (props.mustAddMarginBottom ? 48 : 0)}px auto;

  @media (max-width: 480px) {
    & {
      margin-bottom: ${(props: ContentProps) => (props.mustAddMarginBottom ? 92 : 0)}px;
    }
  }
`;

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<ThemeString>('default');
  const [ready, setReady] = useState(false);

  const isUserAuthorized = useSelector<RootState, boolean>(
    (state) => state.auth.accessToken !== '',
  );

  const hasErrorMessage = useSelector<RootState, boolean>(
    (state) => state.modal.errorMessage !== '',
  );

  const { refresh } = useTokenManager();

  const handleError = useErrorHandler(undefined, () => setReady(true));

  useEffect(() => {
    handleError(async () => {
      const refreshToken = localStorage.getItem('token');
      if (refreshToken) {
        await refresh(refreshToken);
      }
    });
  }, []);

  useEffect(() => {
    const preferredTheme = localStorage.getItem('theme') as ThemeString;
    if (!preferredTheme) {
      return;
    }

    setTheme(preferredTheme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* <Sidebar /> */}
      <Main>
        <BackgroundImage />
        <Content mustAddMarginBottom={isUserAuthorized}>
          <Header />
          {ready && children}
        </Content>
        {isUserAuthorized && <Player />}
      </Main>
      {hasErrorMessage && <Modal />}
    </ThemeProvider>
  );
};

export default Layout;
