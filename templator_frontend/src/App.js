import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ScreensProvider } from './screens/ScreensContext';
import TemplatesList from './pages/TemplatesList';
import EditTemplate from './pages/EditTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import PreviewFinalTemplate from './components/PreviewFinalTemplate';

function App() {
  return (
    <ScreensProvider>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<TemplatesList />} /> {/* Ruta que no sea definido */}
        <Route path="/templatesList" element={<TemplatesList />} />
        <Route path="/template/:id" element={<EditTemplate />} />
        <Route path="/previewFinalTemplate" element={<PreviewFinalTemplate />} />
        <Route path="*" element={<TemplatesList />} />
      </Routes>
      <FooterComponent />
    </ScreensProvider>
  );
}

export default App;