/**
 * Servicio para obtener datos de una API externa vía GET.
 * @template T Parámetros de consulta (por ejemplo, interfaz con las claves y valores a enviar)
 * @template R Tipo de respuesta esperada desde la API
 * @param {string} url - La ruta base de la API
 * @param {T} params - Parámetros de consulta a enviar
 * @returns {Promise<R>} - Promesa con la respuesta tipada de la API
 */
export async function getFormData<
  T extends Record<string, string | number | boolean>,
  R
>(url: string, params: T): Promise<R> {
  // Construimos la cadena de consulta a partir del objeto params
  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      // Opcional: aquí podrías añadir cabeceras si la API lo requiere
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  // Devolvemos el JSON parseado como Promise<R>
  return response.json() as Promise<R>;
}
