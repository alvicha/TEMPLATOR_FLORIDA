import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'summernote/dist/summernote-bs4.css';
import 'summernote/dist/summernote-bs4.min.js';
import 'summernote/dist/lang/summernote-es-ES';
import "./summernote.css";
import FiltersTemplateList from '../components/FiltersTemplateList';
import TableTemplatesList from '../components/TableTemplatesList';
import { useContext, useEffect, useState } from 'react';
import { filterInfoTemplate, getDataContexts } from '../services/services';
import ScreensContext from '../screens/ScreensContext';

const TemplatesList = () => {
    const { setContextsList, setLoading, selectedSortOrder, selectedColumnTable, setTemplates, currentPage, setTotalRecordsTemplates, rows, setAlert, setVisibleAlert } = useContext(ScreensContext);
    const [optionContext, setOptionContext] = useState(null);
    const [nameTemplateSearch, setNameTemplateSearch] = useState("");

    const filterDataTemplates = async () => {
        let data;
        setLoading(true);
        try {
            data = {
                search: nameTemplateSearch || null,
                context: optionContext?.code || null,
                page: currentPage,
                rows: rows,
                column: selectedColumnTable,
                orientation: selectedSortOrder === 1 ? "asc" : "desc"
            }
            await contextsApi();

            const response = await filterInfoTemplate(setAlert, setVisibleAlert, data);
            if (response) {
                const cleanTemplates = response.templates.map(template => ({
                    ...template,
                    contentText: template.data?.es?.content?.replace(/<[^>]+>/g, ''),
                    subjectText: template.data?.es?.subject
                }));
                setTemplates(cleanTemplates);
                setTotalRecordsTemplates(response.total);
                setLoading(false);
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.error("Error al filtrar plantillas:", error);
        } finally {
            setLoading(false);
        }
    }

    const contextsApi = async () => {
        try {
            const response = await getDataContexts(setAlert, setVisibleAlert);
            if (response) {
                setContextsList(response);
            } else {
                setContextsList([]);
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.error("Error fetching contexts API:", error);
        }
    };

    useEffect(() => {
        filterDataTemplates();
    }, [nameTemplateSearch, optionContext, currentPage, rows, selectedColumnTable, selectedSortOrder]);

    return (
        <div>
            <h1 className="title-templates">
                Listado de Plantillas
            </h1>
            <hr style={{
                width: "30%",
                height: "2px",
                backgroundColor: "#007bff",
                border: "none",
                margin: "0 auto",
            }} />

            <div className='mt-5 m-1'>
                <FiltersTemplateList nameTemplateSearch={nameTemplateSearch}
                    setNameTemplateSearch={setNameTemplateSearch}
                    optionContext={optionContext}
                    setOptionContext={setOptionContext}
                />
                <TableTemplatesList filterDataTemplates={filterDataTemplates} />
            </div>

        </div>
    );
};

export default TemplatesList; 