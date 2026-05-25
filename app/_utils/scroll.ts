export const scrollIdIntoView = (id: string | number | undefined) =>
  document.getElementById(`${id}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  });
