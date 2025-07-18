import { useState, type FormEvent } from "react";
import Toast from "./Toast";
declare const grecaptcha: any;

const siteKey = import.meta.env.PUBLIC_RECAPTCHA_V3_SITE_KEY;
const apiUrl = import.meta.env.LARAVEL_API_URL || "http://localhost:8000/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToastClose = () => {
    setResponseMessage("");
    setStatus("idle");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMessage("");

    if (!siteKey) {
      setStatus("error");
      setResponseMessage("La clave de reCAPTCHA no está configurada.");
      console.error("PUBLIC_RECAPTCHA_V3_SITE_KEY no está definida en las variables de entorno.");
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action: "submit" }).then(async (token: string) => {
        try {
          const response = await fetch(apiUrl + "/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, recaptcha_token: token }),
          });

          const result = await response.json();

          if (response.ok) {
            setStatus("success");
            setResponseMessage(result.message || "¡Mensaje enviado con éxito!");
            setFormData({ name: "", email: "", message: "" }); // Limpiar formulario
          } else {
            setStatus("error");
            setResponseMessage(result.message || "Ocurrió un error al enviar el mensaje.");
          }
        } catch (error) {
          setStatus("error");
          setResponseMessage("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
          console.error("Error al enviar el formulario:", error);
        }
      });
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div>
          <label htmlFor="name" className="mb-2 block font-medium text-neutral-700 dark:text-neutral-200">
            Nombre
          </label>
          <input
            type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
            className="w-full rounded-lg border-neutral-300 bg-neutral-50 p-3 text-neutral-800 transition focus:border-sky-500 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-medium text-neutral-700 dark:text-neutral-200">
            Correo Electrónico
          </label>
          <input
            type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full rounded-lg border-neutral-300 bg-neutral-50 p-3 text-neutral-800 transition focus:border-sky-500 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block font-medium text-neutral-700 dark:text-neutral-200">
            Mensaje
          </label>
          <textarea
            id="message" name="message" rows={5} required value={formData.message} onChange={handleChange}
            className="w-full rounded-lg border-neutral-300 bg-neutral-50 p-3 text-neutral-800 transition focus:border-sky-500 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900"
        >
          {status === "loading" ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
      {responseMessage && (status === "success" || status === "error") && (
        <Toast
          message={responseMessage}
          type={status}
          onClose={handleToastClose}
        />
      )}
    </>
  );
}