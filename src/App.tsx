import { useState } from 'react';
import { Button, ChakraProvider, Link } from '@chakra-ui/react';

import ViteLogo from './assets/icons/vite.svg?react';
import ReactLogo from './assets/icons/react.svg?react';
import theme from './ui/theme/theme';

function Wrapper() {
  const [count, setCount] = useState<number>(0);
  return (
    <>
      <div>
        <Link
          href="https://vitejs.dev"
          target="_blank"
          rel="noreferrer"
        >
          <ViteLogo
            className="logo"
            width="6em"
            height="6em"
          />
        </Link>
        <Link
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
        >
          <ReactLogo
            className="logo react"
            width="6em"
            height="6em"
          />
        </Link>
      </div>
      <h1>Vite + React 222</h1>
      <div className="card">
        <Button
          colorScheme="blue"
          onClick={() => setCount((c) => c + 1)}
        >
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Wrapper />
    </ChakraProvider>
  );
}

export default App;
