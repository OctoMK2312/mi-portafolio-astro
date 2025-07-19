import { useState, type FormEvent } from "react";
import Toast from "./Toast"; 
import { sendContactForm } from "../services/api"; 

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

    try {
      const result = await sendContactForm(formData);

      setStatus("success");
      setResponseMessage(result.message || "¡Mensaje enviado con éxito!");
      setFormData({ name: "", email: "", message: "" }); 

    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setResponseMessage(error.message); 
      } else {
        setResponseMessage("Ocurrió un error inesperado.");
      }
      console.error("Error al enviar el formulario:", error);
    }
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
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border-neutral-300 bg-neutral-50 p-3 text-neutral-800 transition focus:border-sky-500 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-medium text-neutral-700 dark:text-neutral-200">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border-neutral-300 bg-neutral-50 p-3 text-neutral-800 transition focus:border-sky-500 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block font-medium text-neutral-700 dark:text-neutral-200">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
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