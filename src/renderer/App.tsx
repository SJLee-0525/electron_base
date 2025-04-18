import "@renderer/App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Galaxy from "@pages/galaxy/Galaxy";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Galaxy />
    </QueryClientProvider>
  );
};

export default App;
