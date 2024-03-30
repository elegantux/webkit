import { AxiosError } from 'axios';

import { CodeEditor } from '@ui/atomic/molecules';
import { PageContainer } from '@ui/atomic/templates/PageContainer';

export function PageError({ error }: { error: AxiosError | any }) {
  if (error instanceof AxiosError) {
    return (
      <PageContainer mx="auto">
        <h1>{error.message}</h1>
        <CodeEditor
          value={error?.response?.data}
          onChange={() => {}}
          codeEditor={null}
          setCodeEditor={() => {}}
          readOnly
          height="620px"
        />
      </PageContainer>
    );
  }

  // eslint-disable-next-line no-console
  console.log('PageError', error);

  return (
    <PageContainer mx="auto">
      <h1>{error?.message}</h1>
      <CodeEditor
        value={JSON.stringify(error, null, 4)}
        onChange={() => {}}
        codeEditor={null}
        setCodeEditor={() => {}}
        readOnly
        height="620px"
      />
    </PageContainer>
  );
}
