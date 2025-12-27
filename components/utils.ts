export const parseDate = (value: any): string => value?.slice(0, 10) || "";

export const getOptions = async (url: string, filter?: (item: any) => boolean) => {
  const data = await fetch(url).then((r) => r.json());
  return (filter ? data.filter(filter) : data).map((item: any) => ({
    id: item.id,
    name: item.name || item.Nombre || item.email || `ID ${item.id}`,
  }));
};