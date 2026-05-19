import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Dashboard from './pages/dashboard';
import Content from './pages/content';
import RoadmapList from './pages/RoadmapList';
import RoadmapDetail from './pages/RoadmapDetails';
import Todo from './pages/todo';
import './App.css';
import Landing from './pages/landingpage';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<Content />} />
          <Route path="/roadmap" element={<RoadmapList />} />
          <Route path="/roadmap/:id" element={<RoadmapDetail />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;