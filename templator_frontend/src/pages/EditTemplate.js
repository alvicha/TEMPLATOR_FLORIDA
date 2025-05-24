import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'summernote/dist/summernote-bs4.css';
import 'summernote/dist/summernote-bs4.min';
import 'summernote/dist/lang/summernote-es-ES';
import "./summernote.css";
import { getDataContexts, getDataApi, getPlaceholdersContexts, updateTemplateApi, listTemplateById, renderTemplatesFinal } from '../services/services';
import DropDownTemplate from '../components/DropdownTemplate';
import ScreensContext from '../screens/ScreensContext';
import ModalError from '../components/ModalError';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { TailSpin } from 'react-loader-spinner';
import PreviewFinalTemplate from '../components/PreviewFinalTemplate';

const EditTemplate = () => {
    const [nameTemplate, setNameTemplate] = useState("");
    const [subjectTemplate, setSubjectTemplate] = useState("");
    const editorRef = useRef(null);
    const [codeLanguage, setCodeLanguage] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedTemplateContent, setSelectedTemplateContent] = useState("");
    const [selectedContextDropdown, setSelectedContextDropdown] = useState("");
    const [selectedLanguageDropdown, setSelectedLanguageDropdown] = useState("");
    const [originalSubjectTemplate, setOriginalSubjectTemplate] = useState("");
    const [visiblePreviewFinalTemplate, setvisiblePreviewFinalTemplate] = useState(false);
    const toast = useRef(null);
    const idTemplateParams = useParams();

    const { editorSummernote, currentContent, setCurrentContent, setAlert, setVisibleAlert, visibleAlert, visibleActionButton, setVisibleActionButton, setContextsList, placeholdersList,
        setPlaceholdersList, templates, setTemplates, listLanguages, setListLanguages, fieldsDisabled, loadingEditor, setLoadingEditor,
        setFieldsDisabled, setPreviewFinalTemplate, visibleButtonPreviewTemplate, setVisibleButtonPreviewTemplate, setSaveRangeEditor } = useContext(ScreensContext);

    const navigate = useNavigate();

    /**
    * Esta función sirve para cargar el menu del editor con las opciones deseadas
    */
    const changeSummernoteLanguage = useCallback((lang) => {
        editorSummernote.current = editorRef.current;

        $(editorRef.current).summernote("destroy");
        $(editorRef.current).summernote({
            placeholder: "Introduce una descripción",
            height: 400,
            lang: lang,
            toolbar: [
                ["style", ["bold", "italic", "underline", "clear"]],
                ["font", ["strikethrough", "superscript", "subscript"]],
                ["fontsize", ["fontsize"]],
                ['fontname', ['fontname']],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]],
                ['insert', ['picture']],
                ['view', ['codeview']]
            ],
            fontNames: ['Sans Serif', 'Serif', 'Monospace'],
            fontNamesIgnoreCheck: ['Sans Serif', 'Serif', 'Monospace'],
            addDefaultFonts: false,
            callbacks: {
                onInit: function () {
                    $(".note-editable").css("font-size", "16px");
                },
                onChange: function (contents) {
                    setCurrentContent(contents);
                },
                onFocus() {
                    const range = $(editorRef.current).summernote('createRange');
                    setSaveRangeEditor(range);
                }
            }
        }).summernote("code", selectedTemplateContent);

        if (fieldsDisabled) {
            $(editorRef.current).summernote("disable");
        }
    }, [selectedTemplateContent, fieldsDisabled]);

    /**
     * Función para que me devuelva la lista de idiomas que hay en la base de datos
     */
    const languagesApi = async () => {
        try {
            const response = await getDataApi(setAlert, setVisibleAlert);
            if (response) {
                setListLanguages(response);
            } else {
                setListLanguages([]);
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.log(error);
        }
    };

    const getSelectedTemplateEditor = async () => {
        try {
            const selectedLanguage = listLanguages.find(lang => lang.code === codeLanguage);
            const response = await listTemplateById(idTemplateParams.id, setAlert, setVisibleAlert);

            if (codeLanguage) {
                setSelectedTemplate(response);
                setNameTemplate(response.code);
                setSubjectTemplate(response.data[codeLanguage].subject);
                setOriginalSubjectTemplate(response.data[codeLanguage].subject);
                setSelectedTemplateContent(response.data[codeLanguage].content);

                if (!selectedLanguageDropdown) {
                    setSelectedLanguageDropdown(selectedLanguage.value);
                }
                setLoadingEditor(false);
            } else {
                setCodeLanguage("es");
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.log(error);
        }
    }

    /**
     * Función para que me devuelva la lista de contextos de la BD
     */
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


    /**
     * Función para que me devuelva la lista de variables dependiendo del contexto
     * @param {*} infoContext Contexto seleccionado 
     */
    const getPlaceholdersApi = async (idContext) => {
        try {
            const response = await getPlaceholdersContexts(idContext, setAlert, setVisibleAlert);
            if (response) {
                setPlaceholdersList(response);
            } else {
                setPlaceholdersList([]);
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.error("Error fetching languages:", error);
        }
    };

    useEffect(() => {
        if (selectedTemplate === "") {
            setFieldsDisabled(true);
            setVisibleButtonPreviewTemplate(false);
        } else {
            setVisibleButtonPreviewTemplate(true);
            setFieldsDisabled(false);
        }
    }, [selectedTemplate]);


    const viewTemplateVariables = async (idTemplate) => {
        setLoadingEditor(true);
        const idUser = 1;
        const idIncident = 1;
        const idGuest = 2;

        try {
            const response = await renderTemplatesFinal(idTemplate, idUser, idGuest, codeLanguage, idIncident, setAlert, setVisibleAlert);

            if (response) {
                setPreviewFinalTemplate(response);
                setvisiblePreviewFinalTemplate(true);
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error al previsualizar plantilla.',
                    life: 4000
                });
            }
            setLoadingEditor(false);
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.error("Ha ocurrido un error:", error);
        }
    }

    /**
     * Función para actualizar una plantilla en la base de datos con llamada a la API
     * @param {*} event Evento del clic en el botón de actualizar plantilla
     */
    const onUpdateTemplate = async (event) => {
        setLoadingEditor(true);
        try {
            event.preventDefault();
            const cleanedContent = cleanHtml(currentContent);
            setSelectedTemplateContent(currentContent);
            setOriginalSubjectTemplate(subjectTemplate);

            const updatedData = { ...selectedTemplate.data };

            updatedData[codeLanguage] = {
                content: cleanedContent,
                subject: subjectTemplate
            };

            let body = {
                code: nameTemplate,
                data: updatedData
            };

            const response = await updateTemplateApi(selectedTemplate.id, body, setAlert, setVisibleAlert);

            if (response) {
                setLoadingEditor(false);
                toast.current.show({ severity: 'success', summary: 'Información', detail: 'Plantilla actualizada con éxito', life: 3000 });
            }
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
            console.error("Error fetching languages:", error);
        }
    };

    /**
     * Función para actualizar el estado del nombre de la plantilla constantemente
     * @param {Event} event - Evento del input.
     */
    const onChangeNameTemplate = (event) => {
        setNameTemplate(event.target.value);
    };

    const onChangeSubjectTemplate = (event) => {
        setSubjectTemplate(event.target.value);
    };

    const cleanHtml = (html) => {
        const $html = $('<div>').html(html);

        $html.find('br').remove();
        $html.find('*').each(function () {
            if ($(this).text().trim() === '' && $(this).children().length === 0 && !$(this).is('img')) {
                $(this).remove();
            }
        });

        return $html.html().trim();
    };

    const isTemplateModified = () => {
        const currentContentSummernote = $(editorRef.current).summernote('code');
        const cleanedInitial = cleanHtml(selectedTemplateContent);
        const cleanedCurrent = cleanHtml(currentContentSummernote);

        return (
            cleanedInitial !== cleanedCurrent ||
            (subjectTemplate ?? "").trim() !== (originalSubjectTemplate ?? "").trim()
        );
    };

    useEffect(() => {
        if (selectedContextDropdown) {
            setFieldsDisabled(true);
            setNameTemplate("");
            setSubjectTemplate("")
            setSelectedTemplate("");
            setSelectedTemplateContent("");
            $(editorRef.current).summernote("code", "");
        }
    }, [selectedContextDropdown]);

    useEffect(() => {
        if (fieldsDisabled) {
            $(editorRef.current).summernote('disable');
        } else {
            $(editorRef.current).summernote('enable');
            setCurrentContent($(editorRef.current).summernote('code'));
        }
    }, [fieldsDisabled]);

    /**
     * Llama a las APIs de idiomas y contextos una vez al montar el componente.
     */
    useEffect(() => {
        languagesApi();
        contextsApi();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoadingEditor(true);
        if (listLanguages.length > 0) {
            getSelectedTemplateEditor();
        }
    }, [listLanguages]);

    useEffect(() => {
        if (listLanguages.length > 0 && !codeLanguage) {
            setCodeLanguage("es");
        }
    }, [listLanguages, codeLanguage]);

    /**
     * Cambia el idioma del editor cuando `codeLanguage` o `actionButtonUpdate` cambian.
     */
    useEffect(() => {
        if (!visiblePreviewFinalTemplate || selectedTemplateContent) {
            changeSummernoteLanguage(codeLanguage);
        }
    }, [codeLanguage, selectedTemplateContent, visiblePreviewFinalTemplate]);

    useEffect(() => {
        if (!visiblePreviewFinalTemplate) {
            setSelectedContextDropdown("");
        }
    }, [visiblePreviewFinalTemplate]);

    useEffect(() => {
        if (isTemplateModified()) {
            setVisibleActionButton(true);
        } else {
            setVisibleActionButton(false);
        }
    }, [selectedTemplateContent, currentContent, subjectTemplate, originalSubjectTemplate]);

    return (
        <>
            {loadingEditor && (
                <div className='containerSpinner'>
                    <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#18787F"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                    />
                </div >
            )}

            <Toast ref={toast} />
            {!visiblePreviewFinalTemplate ? (
                <div>
                    <Button icon="pi pi-arrow-left" label="Volver" className="rounded-pill buttons mt-4 ml-3" onClick={() => navigate('/templatesList')} />

                    <div className="container-edit container mt-4 mb-5">
                        <h1 className="title-edit mb-5">
                            EDICIÓN PLANTILLAS
                        </h1>

                        <hr style={{
                            width: "30%",
                            height: "2px",
                            backgroundColor: "#007bff",
                            border: "none",
                        }} />

                        <div className="filters mt-5 p-1 rounded">
                            <DropDownTemplate
                                templates={templates}
                                setTemplates={setTemplates}
                                selectedTemplate={selectedTemplate}
                                setSelectedTemplate={setSelectedTemplate}
                                selectedTemplateContent={selectedTemplateContent}
                                setSelectedTemplateContent={setSelectedTemplateContent}
                                contextDropDown={selectedContextDropdown}
                                setContextDropDown={setSelectedContextDropdown}
                                codeLanguage={codeLanguage}
                                setCodeLanguage={setCodeLanguage}
                                selectedLanguageDropdown={selectedLanguageDropdown}
                                setSelectedLanguageDropdown={setSelectedLanguageDropdown}
                                placeholdersList={placeholdersList}
                                getPlaceholdersApi={getPlaceholdersApi}
                                nameTemplate={nameTemplate}
                                setNameTemplate={setNameTemplate}
                                subjectTemplate={subjectTemplate}
                                setSubjectTemplate={setSubjectTemplate}
                                setOriginalSubjectTemplate={setOriginalSubjectTemplate}
                                isTemplateModified={isTemplateModified}
                            />
                        </div>

                        <div className="text-right mt-4 mb-3">
                            <Button label="Previsualización final" icon="pi pi-eye" aria-label="vista_previa" className="rounded-pill buttons" onClick={() => viewTemplateVariables(selectedTemplate.id)} disabled={!visibleButtonPreviewTemplate} />
                        </div>

                        <div className="d-flex justify-content-center border border-success mt-2 p-2 rounded">
                            <label for="nameTemplate" className="text-name font-weight-bold m-2">Nombre Plantilla:</label>
                            <InputText id="nameTemplate" keyfilter="alpha" className="form-control w-50" placeholder="Introduce nombre de plantilla" value={nameTemplate} onChange={onChangeNameTemplate} aria-label="NameTemplate" aria-describedby="name-template" readOnly />
                        </div>

                        <div className="d-flex justify-content-start mt-4 mb-3 p-2 rounded">
                            <label for="subjectTemplate" className="text-subject font-weight-bold m-2">Asunto:</label>
                            <InputText id="subject" className="form-control w-100 w-sm-50" placeholder="Introduce asunto de plantilla" value={subjectTemplate} onChange={onChangeSubjectTemplate}
                                onFocus={() => setSaveRangeEditor(null)} disabled={fieldsDisabled} aria-describedby="subject" aria-label="Subject" />
                        </div>

                        <div className="mb-3">
                            <textarea ref={editorRef} id="summernote" className="form-control"></textarea>
                        </div>
                        <div className="text-center mt-4">
                            <Button label="Actualizar Plantilla" icon="pi pi-refresh" aria-label="Actualizar" className="rounded-pill buttons" disabled={!visibleActionButton}
                                onClick={onUpdateTemplate} />
                        </div>
                        {visibleAlert && (
                            <ModalError />
                        )}
                    </div>
                </div>
            ) : (
                <PreviewFinalTemplate setvisiblePreviewFinalTemplate={setvisiblePreviewFinalTemplate} />
            )}
        </>
    );
};

export default EditTemplate; 