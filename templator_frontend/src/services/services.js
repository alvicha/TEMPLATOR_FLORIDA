const endPointLanguage = process.env.REACT_APP_LANGUAGES;
const endPointContexts = process.env.REACT_APP_CONTEXTS;
const endPointVariables = process.env.REACT_APP_VARIABLES;
const endPointListTemplatesByContext = process.env.REACT_APP_TEMPLATES_BY_CONTEXT;
const endPointPostTemplate = process.env.REACT_APP_CREATE_TEMPLATE;
const endPointUpdateTemplate = process.env.REACT_APP_UPDATE_TEMPLATE;
const endPointDeleteTemplate = process.env.REACT_APP_DELETE_TEMPLATE;
const endPointShowTemplateById = process.env.REACT_APP_SHOW_TEMPLATE;
const endPointFilterInfoTemplates = process.env.REACT_APP_FILTER_TEMPLATE;
const endPointGetAllTemplates = process.env.REACT_APP_TEMPLATES;
const endPointRenderTemplate = process.env.REACT_APP_RENDER_TEMPLATE;
const endPointSendEmailTemplate = process.env.REACT_APP_SEND_EMAIL_TEMPLATE;

export const getDataApi = async (setAlert, setVisibleAlert) => {
  try {
    if (endPointLanguage) {
      const response = await fetch(`${endPointLanguage}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error.message);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const getDataContexts = async (setAlert, setVisibleAlert) => {
  try {
    if (endPointContexts) {
      const response = await fetch(`${endPointContexts}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error.message);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const getPlaceholdersContexts = async (idContext, setAlert, setVisibleAlert) => {
  try {
    if (endPointVariables) {
      const response = await fetch(`${endPointVariables}/${idContext}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error.message);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const getTemplatesContexts = async (id, setAlert, setVisibleAlert) => {
  try {
    if (endPointListTemplatesByContext) {
      const response = await fetch(`${endPointListTemplatesByContext}/${id}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const listTemplateById = async (id, setAlert, setVisibleAlert) => {
  try {
    if (endPointShowTemplateById) {
      const response = await fetch(`${endPointShowTemplateById}/${id}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al obtener el contexto indicado: " + error);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const filterInfoTemplate = async (setAlert, setVisibleAlert, data) => {
  try {
    const payload = [
      {
        "pageModel":
        {
          "page": data.page + 1,
          "size": data.rows,
          "orderBy": data.column,
          "orientation": data.orientation
        },
        "filter":
        {
          "search": data.search,
          "context": data.context,
          "department": null,
          "assignedWorker": null,
          "creatorWorker": null
        }
      }
    ];

    const response = await fetch(`${endPointFilterInfoTemplates}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) return await response.json();
  } catch (error) {
    setAlert("Error al realizar el filtrado: " + error.message);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const renderTemplatesFinal = async (idTemplate, idUser, idGuest, codeLanguage, idIncident, setAlert, setVisibleAlert) => {
  try {
    const payload =
    {
      templateId: idTemplate,
      idUser: idUser,
      idHotel: 2,
      idBooking: 2,
      guestId: idGuest,
      languageCode: codeLanguage,
      idIncident: idIncident
    };

    if (endPointRenderTemplate) {
      const response = await fetch(`${endPointRenderTemplate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error);
    setVisibleAlert(true);
    return console.log(error);
  }
}

export const sendEmailTemplates = async (payload, setAlert, setVisibleAlert) => {
  try {
    if (endPointSendEmailTemplate) {
      console.log(payload);
      
      const response = await fetch(`${endPointSendEmailTemplate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error);
    setVisibleAlert(true);
    return console.log(error);
  }
}

export const getAllListTemplatesDB = async (setAlert, setVisibleAlert) => {
  try {
    if (endPointGetAllTemplates) {
      const response = await fetch(`${endPointGetAllTemplates}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al realizar la petición: " + error);
    setVisibleAlert(true);
    return console.log(error);
  }
};

export const createTemplate = async (body, setAlert, setVisibleAlert) => {
  try {
    const response = await fetch(`${endPointPostTemplate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(body);

    if (response.ok) return await response.json();
  } catch (error) {
    setAlert("Ha habido un error al crear la plantilla: " + error.message);
    setVisibleAlert(true);
    console.error('There was a problem with the POST request:', error);
  }
};


export const updateTemplateApi = async (id, body, setAlert, setVisibleAlert) => {
  try {
    const response = await fetch(`${endPointUpdateTemplate}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) return await response.json();
  } catch (error) {
    setAlert("Ha habido un error al actualizar la plantilla: " + error.message);
    setVisibleAlert(true);
    console.error('Ha habido un problema para actualizar:', error);
  }
};

export const deleteTemplateDB = async (idTemplate, setAlert, setVisibleAlert) => {
  try {
    if (endPointDeleteTemplate) {
      const response = await fetch(`${endPointDeleteTemplate}/${idTemplate}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) return await response.json();
    }
  } catch (error) {
    setAlert("Error al eliminar la plantilla: " + error.message);
    setVisibleAlert(true);
    console.error('Ha habido un problema para eliminar:', error);
  }
};