import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { EventList } from "./components/EventList";
import { InputForm } from "./components/InputForm";

const queryClient = new QueryClient();

function App() {
  return (
    <div className='App'>
      <h1>Polkadot Scanner</h1>
      <InputForm />
      <QueryClientProvider client={queryClient}>
        <EventList />
      </QueryClientProvider>
    </div>
  );
}

export default App;
