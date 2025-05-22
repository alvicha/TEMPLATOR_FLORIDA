import { createContext, useRef, useState } from 'react';

const ScreensContext = createContext();

export const ScreensProvider = ({ children }) => {
  const editorSummernote = useRef(null);
  const [alert, setAlert] = useState(null);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [visibleActionButton, setVisibleActionButton] = useState(false);
  const [contextsList, setContextsList] = useState([]);
  const [listLanguages, setListLanguages] = useState([]);
  const [placeholdersList, setPlaceholdersList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [totalRecordsTemplates, setTotalRecordsTemplates] = useState(0);
  const [selectedColumnTable, setSelectedColumnTable] = useState(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [previewFinalTemplate, setPreviewFinalTemplate] = useState(null);
  const [visibleButtonPreviewTemplate, setVisibleButtonPreviewTemplate] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(false);
  const [saveRangeEditor, setSaveRangeEditor] = useState(null);

  return (
    <ScreensContext.Provider value={{
      editorSummernote, alert, setAlert, visibleAlert, setVisibleAlert, visibleActionButton, setVisibleActionButton, contextsList, setContextsList,
      placeholdersList, setPlaceholdersList, templates, setTemplates, currentPage, setCurrentPage, rows, setRows,
      listLanguages, setListLanguages, totalRecordsTemplates, setTotalRecordsTemplates, selectedColumnTable, setSelectedColumnTable, loading,
      setLoading, selectedSortOrder, setSelectedSortOrder, currentContent, setCurrentContent,
      fieldsDisabled, setFieldsDisabled, previewFinalTemplate, setPreviewFinalTemplate, visibleButtonPreviewTemplate,
      setVisibleButtonPreviewTemplate, isEditorFocused, setIsEditorFocused, loadingEditor, setLoadingEditor, saveRangeEditor, setSaveRangeEditor
    }}>
      {children}
    </ScreensContext.Provider>
  );
};

export default ScreensContext;
