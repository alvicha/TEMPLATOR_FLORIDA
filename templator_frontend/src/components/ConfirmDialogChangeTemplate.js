import { ConfirmDialog } from 'primereact/confirmdialog';

const ConfirmDialogChangeTemplate = ({ visibleModalWarning, onCancelChange, message, textButton, acceptModalWarning, rejectModalWarning }) => {
    return (
        <ConfirmDialog
            group="declarative"
            visible={visibleModalWarning}
            onHide={onCancelChange}
            message={message}
            header="Advertencia"
            icon="pi pi-exclamation-triangle"
            acceptLabel={textButton}
            rejectLabel='Cancelar'
            accept={acceptModalWarning}
            reject={rejectModalWarning}
            style={{ width: '90vw', maxWidth: '800px' }}
            acceptClassName='buttons rounded-pill'
            rejectClassName='button-reject'
        />
    )
};

export default ConfirmDialogChangeTemplate; 