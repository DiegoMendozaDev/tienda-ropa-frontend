/**
 * Servicio para enviar datos de un formulario a una API externa.
 * @template T Datos que se envían (por ejemplo, interfaz de formulario)
 * @template R Tipo de respuesta esperada desde la API
 * @param {string} url - La ruta de la API
 * @param {T} data - Datos a enviar
 * @returns {Promise<R>} - Promesa con la respuesta tipada de la API
 */
export async function postFormData<T, R>(url: string, data: T): Promise<R> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }
  
    return response.json() as Promise<R>;
  }
  