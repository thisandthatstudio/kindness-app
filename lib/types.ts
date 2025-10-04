export type Kindness = {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  text?: string;
  presetIds?: string[];
  photoUri?: string;
  createdAt: number;
};

export type PresetAct = {
  id: string;
  label: string;
};