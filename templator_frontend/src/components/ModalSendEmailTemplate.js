import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import ScreensContext from '../screens/ScreensContext';
import { sendEmailTemplates } from '../services/services';
import ModalError from './ModalError';

const ModalSendEmailTemplate = ({ toast, previewFinalTemplate, visibleModalSendEmail, setVisibleModalSendEmail }) => {
    const { setAlert, setVisibleAlert, visibleAlert, setLoadingEditor } = useContext(ScreensContext);
    const [nameAddressee, setNameAddressee] = useState("");
    const [isDisabledSendEmail, setIsDisabledSendEmail] = useState(false);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
        if (nameAddressee !== "") {
            setIsDisabledSendEmail(false);
        } else {
            setIsDisabledSendEmail(true);
        }
    }, [nameAddressee]);

    const sendEmailTemplateDB = async () => {
        if (!isValidEmail(nameAddressee)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Correo introducido no válido' });
            return;
        }

        try {
            setLoadingEditor(true);
            const payload = {
                to: nameAddressee,
                subject: previewFinalTemplate.subject,
                html: previewFinalTemplate.rendered
            }

            const response = await sendEmailTemplates(payload, setAlert, setVisibleAlert);
            if (response) {
                setVisibleModalSendEmail(false);
                toast.current.show({ severity: 'success', summary: 'Enviado', detail: 'Correo de prueba enviado con éxito' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Correo no enviado', detail: 'No se ha podido enviar el correo' });
            }
            setLoadingEditor(false);
        } catch (error) {
            setAlert("Ha ocurrido un error: " + error.message);
            setVisibleAlert(true);
        }
    }

    const footerContent = (
        <div>
            <Button label="Enviar" icon="pi pi-send" className='rounded-pill buttons' aria-label="Enviar correo"
                disabled={isDisabledSendEmail} onClick={sendEmailTemplateDB} autoFocus />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Prueba Envio Correo"
                footer={footerContent}
                visible={visibleModalSendEmail}
                style={{ width: '90vw', maxWidth: '800px' }}
                onHide={() => setVisibleModalSendEmail(false)}
            >
                <div className="mt-3">
                    <label className='mr-3' htmlFor="firstname">Correo Destinatario: </label>
                    <InputText type="email" className="mb-2 w-50" placeholder="Introduce correo de destinatario" value={nameAddressee} onChange={(e) => setNameAddressee(e.target.value)} aria-labelledby="nameAddressee" />
                </div>
            </Dialog>

            {visibleAlert && (
                <ModalError />
            )}
        </div>
    );
}

export default ModalSendEmailTemplate;
