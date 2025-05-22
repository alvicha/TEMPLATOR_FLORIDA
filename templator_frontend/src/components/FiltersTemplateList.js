import { useContext, useEffect, useState } from "react";
import ScreensContext from "../screens/ScreensContext";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import '../pages/summernote.css'

const FiltersTemplateList = ({ nameTemplateSearch, setNameTemplateSearch, optionContext, setOptionContext }) => {
    const { contextsList } = useContext(ScreensContext);
    const [visibleDropDown, setVisibleDropDown] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const onHandleButton = () => {
        const dropDownState = !visibleDropDown;
        setVisibleDropDown(dropDownState);
    }

    const handleClearData = () => {
        setNameTemplateSearch("");
        setOptionContext(null);
    }

    useEffect(() => {
        if (nameTemplateSearch !== "" || optionContext !== null) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [optionContext, nameTemplateSearch, isDisabled]);

    return (
        <div className="mb-4 border ml-1">
            <div className="d-flex justify-content-start filters pt-2 pl-2">
                <i className={visibleDropDown ? "bi bi-chevron-down fa-xl mr-4" : "bi bi-chevron-up fa-xl mr-4"} onClick={onHandleButton}></i>
                <p className="font-weight-bold">Filtros</p>
            </div>

            {visibleDropDown && (
                <div className="bg-white border shadow-sm p-3">
                    <div className="row w-100">
                        {Array.isArray(contextsList) && contextsList.length > 0 && (
                            <div className="col-12 col-md-6 col-lg-6">
                                <p className="text-context font-weight-bold text-left">Contextos</p>
                                <Dropdown
                                    value={optionContext}
                                    onChange={(e) => setOptionContext(e.value)}
                                    options={[{ code: 'Todos' }, ...contextsList]}
                                    optionLabel="code"
                                    placeholder="Seleccionar..."
                                    style={{ width: "100%", marginBottom: '15px', textAlign: "left" }}
                                    aria-label="Seleccionar contexto"
                                />
                            </div>
                        )}
                        <div className="col-12 col-md-6 col-lg-6">
                            <p className="text-filter font-weight-bold text-left">Buscar</p>
                            <InputText value={nameTemplateSearch} placeholder="Nombre" onChange={(e) => setNameTemplateSearch(e.target.value)} style={{ width: "100%" }} aria-label="Buscar por nombre de plantilla" />
                        </div>
                    </div>
                    <div className="text-left mt-2">
                        <Button label="Limpiar" icon="pi pi-times-circle" aria-label="Limpiar" disabled={isDisabled} className="rounded-pill buttons" onClick={handleClearData} />
                    </div>
                </div>
            )}
        </div >
    );
};

export default FiltersTemplateList;