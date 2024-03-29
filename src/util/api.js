const API_END_POINT = process.env.BASE_URL;
export const X_USERNAME = 'jinist';

export const request = async (url, options) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'x-username': X_USERNAME,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetDocuments = async () => {
  return await request('/documents');
};

export const fetchGetDocument = async (documentId) => {
  return await request(`/documents/${documentId}`);
};

export const fetchAddDocument = async (documentId) => {
  return await request(`/documents`, {
    method: 'POST',
    body: JSON.stringify({
      title: null,
      parent: documentId,
    }),
  });
};

export const fetchRemoveDocument = async (documentId) => {
  await request(`/documents/${documentId}`, { method: 'DELETE' });
};

export const fetchRootDocument = async () => {
  await request('/documents', {
    method: 'POST',
    body: JSON.stringify({
      title: null,
      parent: null,
    }),
  });
};

export const fetchEditDocument = async (document) => {
  await request(`/documents/${document.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: document.title,
      content: document.content,
    }),
  });
};
