// src/services/api.ts
declare const grecaptcha: any;

const siteKey = import.meta.env.PUBLIC_RECAPTCHA_V3_SITE_KEY;
const apiUrl = import.meta.env.PUBLIC_API_URL;

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Envía los datos del formulario de contacto al API.
 * Incluye la validación con reCAPTCHA v3.
 * @param formData Los datos del formulario (nombre, email, mensaje).
 * @returns La respuesta JSON del servidor.
 * @throws Un error si la petición falla o la clave de reCAPTCHA no está configurada.
 */
export const sendContactForm = async (formData: ContactFormData) => {
  if (!siteKey) {
    throw new Error("La clave de reCAPTCHA no está configurada.");
  }

  const token = await new Promise<string>((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action: "submit" }).then((token: string) => {
        resolve(token);
      });
    });
  });

  try {
    const response = await fetch(`${apiUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ ...formData, recaptcha_token: token }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Ocurrió un error al enviar el mensaje.");
    }

    return result; 
  } catch (error) {
    console.error("Error en la petición de contacto:", error);
    const errorMessage = error instanceof Error ? error.message : "No se pudo conectar con el servidor.";
    throw new Error(errorMessage);
  }
};