import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deleteTemplateDB } from "../services/services";
import ScreensContext from "../screens/ScreensContext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ModalShowTemplate from "./ModalShowTemplate";
import ModalCreateTemplate from "./ModalCreateTemplate";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import ModalError from "./ModalError";

const TableTemplatesList = ({ filterDataTemplates }) => {
    const navigate = useNavigate();
    const { totalRecordsTemplates, loading, setLoading, selectedSortOrder, setSelectedSortOrder, selectedColumnTable, setSelectedColumnTable,
        currentPage, templates, setAlert, visibleAlert, setVisibleAlert, setCurrentPage, rows, setRows } = useContext(ScreensContext);
    const [showModalDataTemplate, setShowModalDataTemplate] = useState(false);
    const [visibleModalCreateTemplate, setVisibleModalCreateTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const toast = useRef(null);

    const paginatorLeft = "Mostrando " + totalRecordsTemplates + " plantillas en total";

    const refreshData = async () => {
        try {
            await filterDataTemplates();
        } catch (error) {
            setAlert("Error al filtrar plantillas: " + error.message);
            setVisibleAlert(true);
            console.error("Error al filtrar plantillas desde la API:", error);
        }
    };

    const accept = async (idTemplate) => {
        setLoading(true);
        try {
            const response = await deleteTemplateDB(idTemplate, setAlert, setVisibleAlert);
            await filterDataTemplates();

            if (response) {
                setLoading(false);
                toast.current.show({ severity: 'success', summary: 'Información', detail: 'Plantilla eliminada con éxito', life: 3000 });
            }
        } catch (error) {
            setAlert("Error al eliminar plantilla: " + error.message);
            setVisibleAlert(true);
            console.error("Error al eliminar plantilla API:", error);
        }
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Cancelado', detail: 'Se ha cancelado la eliminación de la plantilla', life: 3000 });
    }

    const onDeleteTemplate = (idTemplate) => {
        confirmDialog({
            message: '¿Estás seguro que desea eliminar esta plantilla?',
            header: 'Eliminación Plantilla',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            style: { width: '90vw', maxWidth: '800px' },
            acceptClassName: 'rounded-pill buttons mt-3',
            rejectClassName: 'button-reject',
            accept: () => accept(idTemplate),
            reject
        });
    };

    const onShowDataTemplate = async (template) => {
        setSelectedTemplate(template);
        setShowModalDataTemplate(true);
    }

    const onCreateModalTemplate = () => {
        setVisibleModalCreateTemplate(true);
    }

    const onPage = (event) => {
        setRows(event.rows);
        const newPage = event.first / event.rows;
        setCurrentPage(newPage);
    };

    return (
        <div className="card mb-3 ml-1">
            <div className="d-flex justify-content-between align-items-center text-left bg-white border p-2">
                <Button label="Crear" icon="pi pi-plus" aria-label="Crear" className="rounded-pill buttons" onClick={onCreateModalTemplate} />
                <div className="d-flex justify-content-end align-items-end">
                    <Button icon="pi pi-sync" className="rounded-pill buttons" aria-label="Refrescar" onClick={refreshData} />
                </div>
            </div>

            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
                value={templates} first={currentPage * rows} paginator showGridlines rows={rows} dataKey="id" onPage={onPage} rowsPerPageOptions={[5, 10, 25, 50]}
                lazy paginatorLeft={paginatorLeft} loading={loading} totalRecords={totalRecordsTemplates} sortField={selectedColumnTable} sortOrder={selectedSortOrder}
                onSort={(e) => {
                    setSelectedColumnTable(e.sortField);
                    setSelectedSortOrder(e.sortOrder);
                    filterDataTemplates();
                }}
                emptyMessage="No se han encontrado registros">
                <Column field="id" header="Id" sortable style={{ width: '5%' }}></Column>
                <Column field="context"
                    body={(rowData) => rowData.context || "No hay contexto"}
                    header="Contexto"
                    sortable
                    style={{ width: '5%' }}>
                </Column>
                <Column field="code" header="Nombre" body={(rowData) => rowData.code || "No hay nombre"} sortable style={{ width: '5%' }}></Column>
                <Column
                    field="subject"
                    header="Asunto"
                    style={{ width: '20%' }}
                    body={(rowData) => rowData.subjectText || "No hay asunto"}
                />
                <Column
                    field="content"
                    header="Contenido"
                    body={(rowData) => rowData.contentText || "No hay contenido"}
                    style={{ width: '30%' }}
                />
                <Column header="Acciones" style={{ width: '20%' }} body={(rowData) => (
                    <div className="d-flex w-100 h-25">
                        <Button icon="pi pi-eye" className="rounded-pill mr-1" outlined severity="help" aria-label="Visualización" onClick={() => onShowDataTemplate(rowData)} />
                        <Button icon="pi pi-pen-to-square" className="rounded-pill mr-1" outlined severity="info" aria-label="Edicion" onClick={() => navigate(`/template/${rowData.id}`)} />
                        <Button icon="pi pi-trash" className="rounded-pill mr-1" outlined severity="danger" aria-label="Eliminacion" onClick={() => onDeleteTemplate(rowData.id)} />
                    </div>
                )} />
            </DataTable>

            {
                showModalDataTemplate && (
                    <ModalShowTemplate selectedTemplate={selectedTemplate} showModalDataTemplate={showModalDataTemplate} setShowModalDataTemplate={setShowModalDataTemplate} />
                )
            }

            {
                visibleModalCreateTemplate && (
                    <ModalCreateTemplate visibleModalCreateTemplate={visibleModalCreateTemplate} filterDataTemplates={filterDataTemplates} setVisibleModalCreateTemplate={setVisibleModalCreateTemplate} toast={toast} />
                )
            }

            {
                visibleAlert && (
                    <ModalError />
                )
            }
        </div >
    );
};

export default TableTemplatesList; 