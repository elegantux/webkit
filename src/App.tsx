import { useState } from 'react';
import { Button, Link } from '@chakra-ui/react';

import ViteLogo from './assets/icons/vite.svg?react';
import ReactLogo from './assets/icons/react.svg?react';

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
          isDisabled
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
  return <Wrapper />;
}

export default App;
