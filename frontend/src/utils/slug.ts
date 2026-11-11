// "Mobiliza PET" -> "mobiliza-pet": endereço legível para cada projeto.
const slug = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default slug;
