import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import ScreensContext from '../screens/ScreensContext';
import { Dropdown } from 'primereact/dropdown';
import { createTemplate, getAllListTemplatesDB, getDataApi } from '../services/services';

const ModalCreateTemplate = ({ visibleModalCreateTemplate, setVisibleModalCreateTemplate, filterDataTemplates, toast }) => {
    const { contextsList, setAlert, setVisibleAlert, listLanguages, setListLanguages } = useContext(ScreensContext);
    const [nameTemplate, setNameTemplate] = useState("");
    const [isDisabledAddTemplate, setIsDisabledAddTemplate] = useState(false);
    const [selectedContextTemplate, setSelectedContextTemplate] = useState("");
    const [allTemplates, setAllTemplates] = useState([]);

    const handleContextTemplateChange = (event) => {
        setSelectedContextTemplate(event);
    };

    const languagesApi = async () => {
        try {
            const response = await getDataApi(setAlert, setVisibleAlert);
            if (response) {
                setListLanguages(response);
            } else {
                setListLanguages([]);
            }
        } catch (error) {
            setAlert("Error al obtener los idiomas: " + error.message);
            setVisibleAlert(true);
            console.log(error);
        }
    }

    const getAllTemplatesDB = async () => {
        try {
            const response = await getAllListTemplatesDB(setAlert, setVisibleAlert);
            if (response) {
                setAllTemplates(response.templates);
            } else {
                setAllTemplates([]);
            }
        } catch (error) {
            setAlert("Error al obtener la lista de plantillas: " + error.message);
            setVisibleAlert(true);
            setVisibleModalCreateTemplate(false);
            console.log(error);
        }
    }

    const createTemplateDB = async () => {
        try {
            let data = {};
            listLanguages.forEach(lang => {
                data[lang.code] = {
                    content: "",
                    subject: ""
                };
            });

            const body = {
                code: nameTemplate,
                data: data,
                idContext: selectedContextTemplate.id
            };

            const existsNameTemplatesDB = allTemplates.find(template => template.code.toLowerCase() === nameTemplate.trim().toLowerCase());
            if (existsNameTemplatesDB) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Ya existe una plantilla con ese nombre.'
                });
            } else {
                const response = await createTemplate(body, setAlert, setVisibleAlert);
                if (response) {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Plantilla creada con éxito' });
                    setVisibleModalCreateTemplate(false);
                    await filterDataTemplates();
                }
            }
        } catch (error) {
            setAlert("Error al crear la plantilla: " + error.message);
            setVisibleAlert(true);
            console.error("Error fetching templates:", error);
        }
    };

    useEffect(() => {
        if (visibleModalCreateTemplate) {
            languagesApi();
            getAllTemplatesDB();
        }
    }, [visibleModalCreateTemplate]);

    useEffect(() => {
        if (nameTemplate !== "" && selectedContextTemplate !== "") {
            setIsDisabledAddTemplate(false);
        } else {
            setIsDisabledAddTemplate(true);
        }
    }, [nameTemplate, selectedContextTemplate]);

    const footerContent = (
        <div>
            <Button label="Añadir" icon="pi pi-plus" className='rounded-pill buttons mt-3' aria-label="Crear plantilla"
                disabled={isDisabledAddTemplate} onClick={createTemplateDB} autoFocus />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Creación Plantilla"
                footer={footerContent}
                visible={visibleModalCreateTemplate}
                style={{ width: '90vw', maxWidth: '800px' }}
                onHide={() => setVisibleModalCreateTemplate(false)}
            >
                <div className="mt-3">
                    <label className='mr-3' htmlFor="firstname">Nombre Plantilla: </label>
                    <InputText className="mb-2 w-50" placeholder="Introduce nombre de plantilla" value={nameTemplate} onChange={(e) => setNameTemplate(e.target.value)} aria-labelledby="name" />
                </div>
                <div className="mt-3">
                    <label className='mr-3' htmlFor="firstname">Lista Contextos: </label>
                    <Dropdown
                        value={selectedContextTemplate}
                        onChange={(e) => handleContextTemplateChange(e.value)}
                        options={contextsList}
                        optionLabel="code"
                        placeholder="Contextos"
                        disabled={contextsList.length === 0}
                        aria-label="Seleccionar contexto"
                    />
                </div>
            </Dialog>
        </div>
    );
}

export default ModalCreateTemplate;
