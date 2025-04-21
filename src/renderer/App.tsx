import "@renderer/App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import Galaxy from "@pages/galaxy/Galaxy";
import NetworkPage from "@pages/network/Network";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Galaxy /> */}
      <NetworkPage />
    </QueryClientProvider>
  );
};

export default App;
